import type { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import Anthropic from "@anthropic-ai/sdk";

const SALESFORCE_REPORT_PROMPT = `You are an expert Salesforce analyst.
Given a small sample of rows from a Salesforce report, produce:
1. A concise executive summary
2. Key metrics detected
3. Notable trends or anomalies
4. Suggested next actions

Rules:
- Do NOT invent data
- Base conclusions ONLY on provided rows
- If unsure, say "Insufficient data"

Return STRICT JSON in this format:
{
    "summary": string,
    "metrics": string[],
    "trends": string[],
    "recommendations": string[]
}`;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const supabase = createSupabaseServerClient(req);
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return res.status(401).json({ error: "Unauthorised" });
    }

    const { reportId } = req.body;

    if (!reportId) {
        console.error("Missing reportId in request body:", req.body);
        return res.status(400).json({ error: "Missing reportId" });
    }

    // prevent direct API calls from bypassing the limit
    const { canGenerateReport } = await import("@/lib/usageTrackerServer");
    const usageCheck = await canGenerateReport(user.id);
    
    if (!usageCheck.allowed) {
        return res.status(403).json({ 
            error: usageCheck.reason || "Usage limit exceeded" 
        });
    }

    // fetch the report sample rows
    const { data: samples, error } = await supabase
        .from("report_row_samples")
        .select("sample_rows")
        .eq("report_id", reportId)
        .single();

    if (error || !samples) {
        console.error("Report samples not found:", error);
        return res.status(404).json({ error: "Report samples not found" });
    }

    try {
      
        // call Claude API to generate summary
        const aiResult = await callClaudeAPI(samples.sample_rows);

        // save summary to database
        const { data: summary, error: insertError } = await supabase
            .from("summaries")
            .insert({
                report_id: reportId,
                user_id: user.id,
                summary_text: aiResult.summary,
                summary_struct: aiResult,
                model: "claude-sonnet-4-20250514",
                tokens_used: (aiResult._tokens?.input || 0) + (aiResult._tokens?.output || 0),
            })
            .select()
            .single();

        if (insertError) {
            console.error("Failed to save summary:", insertError);
            return res.status(500).json({ error: "Failed to save summary" });
        }

        // update report status
        await supabase
            .from("reports")
            .update({
              status: "summarized",
              summary_id: summary.id,
            })
            .eq("id", reportId);

        return res.status(200).json({
            success: true,
            summary: aiResult,
            summaryId: summary.id,
        });
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        console.error("AI summarization error:", errorMessage);
        
        // update report status to failed
        await supabase
            .from("reports")
            .update({ status: "failed" })
            .eq("id", reportId);

        return res.status(500).json({
            error: "Failed to generate summary",
            details: errorMessage,
        });
    }
}

/**
 * Call Claude API using official SDK
 */
async function callClaudeAPI(rows: Record<string, unknown>[]) {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error(
            "ANTHROPIC_API_KEY not configured. Add it to your environment variables."
        );
    }

    // initialize Anthropic client
    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const sampleData = rows.slice(0, 50);
    const headers = Object.keys(sampleData[0] || {});

    const prompt = `${SALESFORCE_REPORT_PROMPT}

    REPORT DATA:
    Columns: ${headers.join(", ")}
    Number of rows: ${sampleData.length}

    Sample rows (JSON):
    ${JSON.stringify(sampleData, null, 2)}

    Analyze this data and respond with ONLY valid JSON matching the specified format. Do not include markdown code blocks or any other text.`;

    try {
        const message = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2000,
            temperature: 0.3,
            messages: [
            {
                role: "user",
                content: prompt,
            },
            ],
        });

        // extract text content
        const content = message.content[0];

        if (content.type !== "text") {
            throw new Error("Unexpected response type from Claude");
        }

        const responseText = content.text;

        // parse the JSON response
        try {
            const cleaned = responseText
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();

            const parsed = JSON.parse(cleaned);

            // return the parsed result with token usage
            return {
                ...parsed,
                _tokens: {
                    input: message.usage.input_tokens,
                    output: message.usage.output_tokens,
                },
            };
        } catch (parseError) {
            console.error("Failed to parse Claude response:", parseError);
            console.error("Raw response:", responseText);
            throw new Error(`Failed to parse Claude response: ${responseText.substring(0, 200)}...`);
        }
    } catch (error) {
        console.error("Claude API error:", error);
        throw error;
    }
}
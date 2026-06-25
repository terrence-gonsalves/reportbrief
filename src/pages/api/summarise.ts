import type { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import Anthropic from "@anthropic-ai/sdk";

const SALESFORCE_REPORT_PROMPT = `You are an expert Salesforce analyst and business strategist.

CONTEXT ANALYSIS:
First, analyze the data to determine the report type (Opportunities, Accounts, Custom Objects, etc.)
Then provide insights tailored to that context.

INSTRUCTIONS:
Given a sample of rows from a Salesforce report, produce:

1. EXECUTIVE SUMMARY (2-3 sentences)
   - What is this report about?
   - What is the current state/health?
   - One key insight that jumps out

2. KEY METRICS (Specific numbers from the data)
   - Quantify what you see (e.g., "5 deals in Proposal stage worth $2.1M")
   - Include status breakdowns if applicable
   - Calculate totals/averages where relevant
   - Reference specific field values from the data

3. NOTABLE TRENDS & ANOMALIES (Business significance)
   - Patterns that stand out (e.g., "80% of deals are in early stages")
   - Unusual data points that warrant attention
   - Comparisons within the dataset (e.g., "Rep A has 3x more opportunities than Rep B")
   - Red flags or concerning patterns

4. ACTIONABLE NEXT STEPS (Specific, business-focused)
   - What should the user DO based on this data?
   - Include specific metrics or thresholds that triggered the recommendation
   - Be prescriptive, not just descriptive
   - Examples:
     * "Follow up on 7 proposals that have been in that stage >30 days"
     * "Coach underperforming reps (bottom 25%) with top performer methods"
     * "Investigate the 2 accounts with declining revenue YoY"

CRITICAL RULES:
- Base ALL conclusions ONLY on the provided data rows
- If you reference a number, it must come directly from the data
- Do NOT calculate percentages or averages not evident in the sample
- If you lack sufficient data to draw a conclusion, say "Insufficient data: [explanation]"
- Never invent fields, values, or data points
- Focus on actionable insights, not obvious statements
- Be specific: "3 deals at risk of slipping" not "some deals at risk"

RESPONSE FORMAT - Return STRICT JSON only (no markdown, no preamble):
{
    "summary": "string (2-3 sentences of critical insight)",
    "metrics": [
        "string (specific number from data)",
        "string (another measurable fact)"
    ],
    "trends": [
        "string (pattern or anomaly with business significance)",
        "string (comparison or unusual finding)"
    ],
    "recommendations": [
        "string (specific, actionable next step with metric/threshold)",
        "string (another concrete action)"
    ]
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
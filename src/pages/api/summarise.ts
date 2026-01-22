import type { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

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

  console.log("Summarise API called with:", { reportId, body: req.body });

  if (!reportId) {
    console.error("Missing reportId in request body:", req.body);
    return res.status(400).json({ error: "Missing reportId" });
  }

  // fetch the report sample rows
  const { data: samples, error } = await supabase
    .from("report_row_samples")
    .select("sample_rows")
    .eq("report_id", reportId)
    .single();

  if (error || !samples) {
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
        summary_struct: aiResult, // store full structured response
        model: "claude-sonnet-4-20250514",
        tokens_used: 0, // we'll update this later when we have token tracking
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
    const errorMessage = e instanceof Error ? e.message : 'Uknown error';
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
 * Call Claude API directly from server
 * Uses ANTHROPIC_API_KEY environment variable
 */
async function callClaudeAPI(rows: Record<string, unknown>[]) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY not configured. Add it to .env.local or use the proxy method for free testing."
    );
  }

  const sampleData = rows.slice(0, 50);
  const headers = Object.keys(sampleData[0] || {});

  const prompt = `${SALESFORCE_REPORT_PROMPT}

    REPORT DATA:
    Columns: ${headers.join(", ")}
    Number of rows: ${sampleData.length}

    Sample rows (JSON):
    ${JSON.stringify(sampleData, null, 2)}

    Analyze this data and respond with ONLY valid JSON matching the specified format. Do not include markdown code blocks or any other text.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const content = data.content[0].text;

  // parse the JSON response
  try {
    const cleaned = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    console.error("Failed to parse Claude response: ", errorMessage);

    throw new Error(`Failed to parse Claude response: ${content}`);
  }
}
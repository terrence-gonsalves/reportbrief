import { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { triggerSummaryEmails } from "@/lib/emailTriggers";
import { logException } from "@/lib/errorLog";
import { logAuditEvent } from "@/lib/auditLog";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const supabase = createSupabaseServerClient(req);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { reportId, summaryId, generationTime } = req.body;

    if (!reportId || !summaryId || typeof generationTime !== "number") {
      return res.status(400).json({
        error: "Missing required fields: reportId, summaryId, generationTime",
      });
    }

    // trigger summary emails (summary_ready + usage warnings if applicable)
    await triggerSummaryEmails({
      userId: user.id,
      reportId,
      summaryId,
      generationTime,
    });

    await logAuditEvent("email_processed", user.id, {
      component: "onSummaryComplete",
      action: "triggerSummaryEmails",
      reportId,
      summaryId,
    });

    return res.status(200).json({
      success: true,
      message: "Summary emails triggered successfully",
    });
  } catch (e) {
    await logException(e, {
      component: "onSummaryComplete",
      action: "triggerEmails",
    });

    console.error("Error in on-summary-complete: ", e);

    return res.status(500).json({
      error: "Failed to trigger summary emails",
      details: e instanceof Error ? e.message : "Unknown error",
    });
  }
}

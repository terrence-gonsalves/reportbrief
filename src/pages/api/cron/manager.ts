import { NextApiRequest, NextApiResponse } from "next";
import { processEmailQueue } from "@/emails/utils/process-queue";
import {
  queueMonthlyResetEmails,
  queueFirstReportReminders,
  queueInactiveUserEmails,
} from "@/lib/emailTriggers";
import { logException } from "@/lib/errorLog";
import { logAuditEvent } from "@/lib/auditLog";

type CronJob = "email_queue" | "monthly_reset" | "first_report_reminder" | "inactive_user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { secret, job } = req.query;

  // validate secret (required)
  if (!secret || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // validate job parameter
  const validJobs: CronJob[] = [
    "email_queue",
    "monthly_reset",
    "first_report_reminder",
    "inactive_user",
  ];

  if (!job || typeof job !== "string" || !validJobs.includes(job as CronJob)) {
    return res.status(400).json({
      error: "Invalid or missing job parameter",
      validJobs,
    });
  }

  const cronJob = job as CronJob;

  try {
    console.log(`Cron job triggered: ${cronJob}`);

    let results;

    switch (cronJob) {
      case "email_queue":
        results = await processEmailQueue();
        break;

      case "monthly_reset":
        results = await queueMonthlyResetEmails();
        break;

      case "first_report_reminder":
        results = await queueFirstReportReminders();
        break;

      case "inactive_user":
        results = await queueInactiveUserEmails();
        break;

      default:
        return res.status(400).json({
          error: "Unknown job type",
          job: cronJob,
        });
    }

    await logAuditEvent("email_processed", null, {
      component: "cronManager",
      action: cronJob,
      results,
    });

    return res.status(200).json({
      success: true,
      job: cronJob,
      message: `Cron job '${cronJob}' completed successfully`,
      results,
    });
  } catch (e) {
    await logException(e, {
      component: "cronManager",
      action: cronJob,
    });

    console.error(`Error in cron job '${cronJob}':`, e);

    return res.status(500).json({
      success: false,
      job: cronJob,
      error: `Failed to execute cron job '${cronJob}'`,
      details: e instanceof Error ? e.message : "Unknown error",
    });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { processEmailQueue } from "@/emails/utils/process-queue";
import { logException } from "@/lib/errorLog";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const authHeader = req.headers.authorization;

    // production
    if (process.env.NODE_ENV === "production") {
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return res.status(401).json({ error: "Unauthorized" });
        }
    }

    try {
        console.log("Cron job triggered: process-email-queue");

        const results= await processEmailQueue();

        return res.status(200).json({
            success: true,
            message: "Email queue processed successfully",
            results:  results,
        });
    } catch (e) {
        await logException(e, {
            component: "processHandler",
            action: "processEmails",
        });

        console.error("Error in process-email-queue cro n: ", e);

        return res.status(500).json({
            success: false,
            error: "Failed to process email queue",
            details: e instanceof Error ? e.message : "Unknown",
        });
    }
}
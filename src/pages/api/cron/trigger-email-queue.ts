import { NextApiRequest, NextApiResponse } from "next";
import { processEmailQueue } from "@/emails/utils/process-queue";
import { logException } from "@/lib/errorLog";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { secret } = req.query;

    if (secret !== process.env.CRON_SECRET) {
        return res.status(401).json({ error: "Unauthrozed" });
    }

    try {
        const results = await processEmailQueue();

        return res.status(200).json({
            success: true,
            error: "Email queue processed successfully",
            results: results,
        });
    } catch (e) {        
        await logException(e, {
            component: "triggerEmailHandler",
            action: "triggerEmail",
        });

        return res.status(500).json({
            success: false,
            error: "Failed to process email queue",
            details: e instanceof Error ? e.message : "Unknown error",
        });
    }
}
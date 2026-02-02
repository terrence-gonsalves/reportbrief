import { NextApiRequest, NextApiResponse } from "next";
import { processEmailQueue } from "@/emails/utils/process-queue";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    // DELETE this file after testing
    try {
        console.log("Manual test: processing email queue");

        const results = await processEmailQueue();

        return res.status(200).json({
            success: true,
            message: "Email queue processed successfully",
            results: results,
        });
    } catch (e) {
        console.error("Error processing queue: ", e);

        return res.status(500).json({
            success: false,
            message: "Failed to process email queue",
            details: e instanceof Error ? e.message : "Unknown error",
        });
    }
}
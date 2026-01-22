import type { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { logAuditEvent } from "@/lib/auditLog";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // authenticate user
    const supabase = createSupabaseServerClient(req);
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return res.status(401).json({ error: "Unauthorised" });
    }

    const { eventType, payload } = req.body;

    if (!eventType) {
        return res.status(400).json({ error: "eventType is required" });
    }

    try {
        await logAuditEvent(eventType, user.id, payload || {});
        
        return res.status(200).json({ success: true });
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        console.error("Log event error: ", errorMessage);

        return res.status(500).json({ error: "Failed to log event" });
    }
}
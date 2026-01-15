import type { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { canGenerateReport } from "@/lib/usageTracker";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
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

    try {
        const result = await canGenerateReport(user.id);

        return res.status(200).json(result);
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        console.error("Check usage error: ", errorMessage);

        return res.status(500).json({ error: "Failed to check usage" });
    }
}
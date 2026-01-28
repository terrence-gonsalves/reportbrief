import { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {      
        const supabase = createSupabaseServerClient(req);
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return res.status(401).json({ error: "Unauthorised" });
        }

        const { userId, emailType, data } = req.body;

        // validate request body
        if (!userId || !emailType || !data) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("email, email_preferences(*)")
            .eq("id", userId)
            .single();

        if (userError || !userData) {
            return res.status(404).json({ error: "User not found" });
        }

        const preferencesArray = userData.email_preferences;
        const preferences = Array.isArray(preferencesArray) && preferencesArray.length > 0 
            ? preferencesArray[0] as Record<string, boolean>
            : null;

        const preferenceMap: { [key: string]: string } = {
            welcome: "welcome_email",
            summary_ready: "summary_ready",
            usage_warning: "usage_warnings",
            usage_limit: "usage_warnings",
            monthly_reset: "monthly_reset",
        };

        const preferenceField = preferenceMap[emailType];

        // is user has opted out (right now they cannot) don't queue
        if (preferenceField && preferences && preferences[preferenceField] === false) {
            return res.status(200).json({ 
                message: "Email not queued - user opted out",
                queued: false
            });
        }

        // generate email subject based on type
        const subjectMap: { [key: string]: string } = {
            welcome: "Welcome to ReportBrief! 🎉",
            summary_ready: "Your report summary is ready ✓",
            usage_warning: "You have 1 report remaining this month",
            usage_limit: "You've reached your monthly limit",
            monthly_reset: "Your 5 free reports have reset! 🔄",
        };
        const subject = subjectMap[emailType] || "ReportBrief Notifications";

        // generate email
        const { data: queuedEmail, error: queueError } = await supabase
            .from("email_queue")
                .insert({
                    user_id: userId,
                    email_type: emailType,
                    to_email: userData.email,
                    subject: subject,
                    status: "pending",
                    metadata: data,
                    scheduled_at: new Date().toISOString(),
                })
            .select()
            .single();

        if (queueError) {
            throw queueError;
        }

        return res.status(200).json({
            message: "Email queued successfully",
            queued: true,
            emailId: queuedEmail.id,
        });
    } catch (e) {
        console.error("Error queuing email: ", e);

        return res.status(500).json({
            error: "Failed to queue email",
            details: e instanceof Error ? e.message : "Unknown error"
        });
    }
}
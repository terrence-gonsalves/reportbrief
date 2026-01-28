import { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("=== EMAIL QUEUE API CALLED ===");
    console.log("Method:", req.method);
    console.log("Body:", req.body);
    console.log("Headers:", req.headers);

    if (req.method !== "POST") {
        console.log("❌ Method not allowed");
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {      
        const supabase = createSupabaseServerClient(req);

        console.log("Verifying user authentication...");
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        console.log("Auth user:", user?.id);
        console.log("Auth error:", authError);

        if (authError || !user) {
            console.log("❌ Unauthorized");
            return res.status(401).json({ error: "Unauthorised" });
        }

        const { userId, emailType, data } = req.body;

        // validate request body
        if (!userId || !emailType || !data) {
            console.log("❌ Missing required fields");
            return res.status(400).json({ error: "Missing required fields" });
        }

        console.log("Fetching user data...");
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("email, email_preferences(*)")
            .eq("id", userId)
            .single();

        console.log("User data:", userData);
        console.log("User error:", userError);

        if (userError || !userData) {
            console.log("❌ User not found");
            return res.status(404).json({ error: "User not found" });
        }

        const preferencesArray = userData.email_preferences;
        const preferences = Array.isArray(preferencesArray) && preferencesArray.length > 0 
            ? preferencesArray[0] as Record<string, boolean>
            : null;

        console.log("Email preferences:", preferences);

        if (preferences) {
            const preferenceMap: { [key: string]: string } = {
                welcome: "welcome_email",
                summary_ready: "summary_ready",
                usage_warning: "usage_warnings",
                usage_limit: "usage_warnings",
                monthly_reset: "monthly_reset",
            };

            const preferenceField = preferenceMap[emailType];

            console.log("Preference field:", preferenceField);
            console.log("Preference value:", preferences[preferenceField]);

            // is user has opted out (right now they cannot) don't queue
            if (preferenceField && preferences && preferences[preferenceField] === false) {
                console.log("❌ User opted out of this email type");
                return res.status(200).json({ 
                    message: "Email not queued - user opted out",
                    queued: false
                });
            }
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

        console.log("Email subject:", subject);
        console.log("To email:", userData.email);

        console.log("Inserting into email_queue...");
        const insertData = {
            user_id: userId,
            email_type: emailType,
            to_email: userData.email,
            subject: subject,
            status: "pending",
            metadata: data,
            scheduled_at: new Date().toISOString(),
        };

        console.log("Insert data:", insertData);

        // generate email
        const { data: queuedEmail, error: queueError } = await supabase
            .from("email_queue")
            .insert(insertData)
            .select()
            .single();

        console.log("Queued email result:", queuedEmail);
        console.log("Queue error:", queueError);

        if (queueError) {
            console.log("❌ Error queueing email:", queueError);
            throw queueError;
        }

        console.log("✅ Email queued successfully");
        return res.status(200).json({
            message: "Email queued successfully",
            queued: true,
            emailId: queuedEmail.id,
        });
    } catch (e) {
        console.error("❌ Exception in email queue handler:", e);

        return res.status(500).json({
            error: "Failed to queue email",
            details: e instanceof Error ? e.message : "Unknown error"
        });
    } finally {
        console.log("=== EMAIL QUEUE API END ===");
    }
}
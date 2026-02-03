import { Resend } from "resend";
import { renderEmail, EmailData } from "./render-email";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { logException } from "@/lib/errorLog";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailData {
    to: string;
    subject: string;
    emailType: string;
    data: EmailData;
}

/**
 * Sends an email using Resend
 * @param to - Recipient email address
 * @param subject - Email subject line
 * @param emailType - Type of email template to use
 * @param data - Data to pass to the email template
 * @returns Resend API response
 */
export async function sendEmail({
    to,
    subject,
    emailType,
    data,
}: SendEmailData) {
    console.log("\n=== SEND EMAIL FUNCTION CALLED ===");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Email Type:", emailType);
    console.log("Data:", JSON.stringify(data, null, 2));

    const { data: { session } } = await supabaseAdmin.auth.getSession();

    try {
        console.log("Checking Resend API key...");
        console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY ? 
        `Set (starts with: ${process.env.RESEND_API_KEY.substring(0, 10)}...)` : 
        "NOT SET ❌"
        );

        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY environment variable is not set");
        }

        console.log("Rendering email template...");
        const html = await renderEmail(emailType, data); // render to html
        console.log("Email HTML rendered successfully (length:", html.length, "chars)");
        console.log("First 200 chars of HTML:", html.substring(0, 200));

        console.log("Sending email via Resend...");
        // send email
        const result = await resend.emails.send({
            from: "ReportBrief <onboarding@resend.dev>", // update to verified later noreply@reportbrief.ca
            to: to,
            subject: subject,
            html: html,
        });

        // log event for queuing email (only when we have a session)
        if (session) {
            await fetch("/api/log-events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    eventType: "send_email",
                    payload: {
                        level: "info",
                        message: "Email sent successfully",
                        component: "sendEmail",
                        action: "sent email",
                    },
                }),
            });
        }

        console.log("✅ Resend API response:", JSON.stringify(result, null, 2));
        console.log("Email sent successfully!");

        return result;
    } catch (e) {
        await logException(e, {
            component: "sendEmail",
            action: "sendingEmail",
        });

        console.error("\n❌ ERROR IN SEND EMAIL:");
        console.error("Error type:", e?.constructor?.name);
        console.error("Error message:", e instanceof Error ? e.message : e);
        console.error("Error stack:", e instanceof Error ? e.stack : "No stack trace");

        if (e && typeof e === 'object' && 'response' in e) {
            console.error("Resend API error details:", JSON.stringify(e, null, 2));
        }
            
        throw e;
    }
}
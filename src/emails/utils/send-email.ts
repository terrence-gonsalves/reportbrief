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

    // as I do not have a domain in place I can only send test emails to this address: terrence@bloopa.co
    let testEmail = '';

    if (to !== "terrence@bloopa.co") {
        testEmail = "terrence@bloopa.co";
    }

    const { data: { session } } = await supabaseAdmin.auth.getSession();

    try {
        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY environment variable is not set");
        }
        
        const html = await renderEmail(emailType, data); // render to html
        
        // send email
        const result = await resend.emails.send({
            from: "ReportBrief <onboarding@resend.dev>", // update to verified later noreply@reportbrief.ca
            to: testEmail,
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
                    eventType: "email_sent",
                    payload: {
                        level: "info",
                        message: "Email sent successfully",
                        component: "sendEmail",
                        action: "sent email",
                    },
                }),
            });
        }

        return result;
    } catch (e) {
        await logException(e, {
            component: "sendEmail",
            action: "sendingEmail",
        });

        if (e && typeof e === 'object' && 'response' in e) {
            console.error("Resend API error details:", JSON.stringify(e, null, 2));
        }
            
        throw e;
    }
}
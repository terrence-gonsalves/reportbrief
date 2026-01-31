import { Resend } from "resend";
import { renderEmail, EmailData } from "./render-email";
import { supabase } from "@/lib/supabaseClient";
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
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const html = await renderEmail(emailType, data); // render to html

        // send email
        const result = await resend.emails.send({
            from: "ReportBrief <onboarding@resend.dev>, // update to verified later noreply@reportbrief.ca>", 
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

        console.log("Email sent successfully: ", result);

        return result;
    } catch (e) {
        await logException(e, {
            component: "sendEmail",
            action: "sendingEmail",
        });

        console.error("Error sending email: ", e);
    }
}
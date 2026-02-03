import { sendEmail } from "./send-email";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { logException } from "@/lib/errorLog";

/**
 * Processes pending emails in the queue
 * Finds pending emails, sends them via Resend, and updates their status
 * @returns Object with counts of processed, sent, and failed emails
 */
export async function processEmailQueue() {
    try {
        console.log("=== PROCESSING EMAIL QUEUE ===");
        console.log("Current time:", new Date().toISOString());
        
        console.log("Querying for pending emails...");

        const { data: { session } } = await supabaseAdmin.auth.getSession();

        // get all pending emails
        const { data: pendingEmails, error: fetchError } = await supabaseAdmin
            .from("email_queue")
            .select("*")
            .eq("status", "pending")
            .lte("scheduled_at", new Date().toISOString())
            .order("created_at", { ascending: true })
            .limit(50);

        console.log("Query completed");
        console.log("Fetch error:", fetchError);
        console.log("Pending emails found:", pendingEmails?.length || 0);
        console.log("Pending emails data:", JSON.stringify(pendingEmails, null, 2));

        if (fetchError) {
            await logException(fetchError, {
                component: "processEmailQueue",
                action: "fetchEmail",
            });

            console.error("Error fetching pending emails: ", fetchError);
            throw fetchError;
        }

        if (!pendingEmails || pendingEmails.length === 0) {
            console.log("No pending emails to process");

            const { data: allEmails } = await supabaseAdmin
                .from("email_queue")
                .select();
      
            console.log("Total emails in queue (all statuses):", allEmails?.length || 0);
            console.log("All emails:", JSON.stringify(allEmails, null, 2));

            // await logException(fetchError, {
            //     component: "processEmailQueue",
            //     action: "noPendingEmails",
            // });

            return {
                processed: 0,
                sent: 0,
                failed: 0,
            };
        }

        console.log(`Found ${pendingEmails.length} pending emails`);

        let sentCount = 0;
        let failedCount = 0;

        for (const email of pendingEmails) {
            console.log(`Processing email ${email.id} (${email.email_type}) to ${email.to_email}`);

            try {
                await sendEmail({
                    to: email.to_email,
                    subject: email.subject,
                    emailType: email.email_type,
                    data: email.metadata || {},
                });

                const { error: updateError } = await supabaseAdmin
                    .from("email_queue")
                    .update({
                        status: "sent",
                        sent_at: new Date().toISOString(),
                        error_message: null,
                    })
                    .eq("id", email.id);

                if (updateError) {
                    await logException(updateError, {
                        component: "processEmailQueue",
                        action: "updatingEmailToSent",
                    });

                    console.error(`Error updating email ${email.id}: `, updateError);
                } else {
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
                    
                    console.log(`✅ Email ${email.id} sent successfully`);
                    sentCount++;
                }
            } catch (e) {
                await logException(e, {
                    component: "processEmailQueue",
                    action: "failedToSendEmail",
                });

                console.error(`❌ Failed to send email ${email.id}:`, e);

                const { error: updateError } = await supabaseAdmin
                    .from("email_queue")
                    .update({
                        status: "failed",
                        error_message: e,
                    })
                    .eq("id", email.id);

                if (updateError) {
                    await logException(e, {
                        component: "processEmailQueue",
                        action: "failedToUpdateEmailStatus",
                    });

                    console.error(`Error updating failed email ${email.id}:`, updateError);
                }

                failedCount++;
            }
        }

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
                        component: "processEmailQueue",
                        action: "processEmailQueue",
                    },
                }),
            }).catch(e => console.error("Failed to log email sent: ", e));
        }

        return {
            processed: pendingEmails.length,
            sent: sentCount,
            failed: failedCount,
        };
    } catch (e) {
        await logException(e, {
            component: "processEmailQueue",
            action: "errorProcessEmailQueue",
        });

        console.error("Error processing email queue: ", e);
        throw e;
    }
}
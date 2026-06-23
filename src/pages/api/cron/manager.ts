import { NextApiRequest, NextApiResponse } from "next";
import { processEmailQueue } from "@/emails/utils/process-queue";
import {
    queueMonthlyResetEmails,
    queueFirstReportReminders,
    queueInactiveUserEmails,
    queueAccountDeletionWarningEmails,
} from "@/lib/emailTriggers";
import { logException } from "@/lib/errorLog";
import { logAuditEvent } from "@/lib/auditLog";
import { supabaseAdmin } from "@/lib/supabaseServer";

type CronJob = 
    | "email_queue" 
    | "monthly_reset" 
    | "first_report_reminder" 
    | "inactive_user"
    | "delete_inactive_accounts";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { secret, job } = req.query;

    // validate secret (required)
    if (!secret || secret !== process.env.CRON_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // validate job parameter
    const validJobs: CronJob[] = [
        "email_queue",
        "monthly_reset",
        "first_report_reminder",
        "inactive_user",
        "delete_inactive_accounts",
    ];

    if (!job || typeof job !== "string" || !validJobs.includes(job as CronJob)) {
        return res.status(400).json({
            error: "Invalid or missing job parameter",
            validJobs,
        });
    }

    const cronJob = job as CronJob;

    try {
        console.log(`Cron job triggered: ${cronJob}`);

        let results;

        switch (cronJob) {
            case "email_queue":
                results = await processEmailQueue();
                break;

            case "monthly_reset":
                results = await queueMonthlyResetEmails();
                break;

            case "first_report_reminder":
                results = await queueFirstReportReminders();
                break;

            case "inactive_user":
                results = await queueInactiveUserEmails();
                break;

            case "delete_inactive_accounts":
                results = await deleteInactiveAccounts();
                break;

            default:
                return res.status(400).json({
                    error: "Unknown job type",
                    job: cronJob,
                });
        }

        await logAuditEvent("email_processed", null, {
            component: "cronManager",
            action: cronJob,
            results,
        });

        return res.status(200).json({
            success: true,
            job: cronJob,
            message: `Cron job '${cronJob}' completed successfully`,
            results,
        });
    } catch (e) {
        await logException(e, {
            component: "cronManager",
            action: cronJob,
        });

        console.error(`Error in cron job '${cronJob}':`, e);

        return res.status(500).json({
            success: false,
            job: cronJob,
            error: `Failed to execute cron job '${cronJob}'`,
            details: e instanceof Error ? e.message : "Unknown error",
        });
    }
}

/**
 * Delete inactive accounts
 * - Unpaid users: 37+ days inactive
 * - Paid users: 60+ days inactive
 */
async function deleteInactiveAccounts() {
    console.log("=== DELETE INACTIVE ACCOUNTS STARTED ===");

    const now = new Date();

    // delete unpaid users inactive for 37+ days
    const thirtySevenDaysAgo = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - 37
    );

    const { data: unpaidInactiveUsers, error: unpaidError } = await supabaseAdmin
        .from("users")
        .select("id, email, subscription:subscriptions(status)")
        .lt("updated_at", thirtySevenDaysAgo.toISOString());

    if (unpaidError) {
        console.error("Error fetching unpaid inactive users:", unpaidError);

        await logException(unpaidError, {
            component: "cronManager",
            action: "deleteInactiveAccounts",
        });

        throw unpaidError;
    }

    // filter to only unpaid users (no active subscription)
    const unpaidToDelete = (unpaidInactiveUsers || []).filter((user) => {
        const subscriptions = (user.subscription || []) as Array<{ status: string }>;

        const hasActiveSubscription = subscriptions?.some(
            (sub) => sub.status === "active"
        );

        return !hasActiveSubscription;
    });

    console.log(`Found ${unpaidToDelete.length} unpaid users to delete (37+ days inactive)`);

    // delete paid users inactive for 60+ days
    const sixtyDaysAgo = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - 60
    );

    const { data: paidInactiveUsers, error: paidError } = await supabaseAdmin
        .from("users")
        .select("id, email, subscription:subscriptions(status)")
        .lt("updated_at", sixtyDaysAgo.toISOString());

    if (paidError) {
        console.error("Error fetching paid inactive users:", paidError);

        await logException(paidError, {
            component: "cronManager",
            action: "deleteInactiveAccounts",
        });

        throw paidError;
    }

    // filter to only paid users (have active subscription)
    const paidToDelete = (paidInactiveUsers || []).filter((user) => {
        const subscriptions = (user.subscription || []) as Array<{ status: string }>;

        const hasActiveSubscription = subscriptions?.some(
            (sub) => sub.status === "active"
        );

        return hasActiveSubscription;
    });

    console.log(`Found ${paidToDelete.length} paid users to delete (60+ days inactive)`);

    const allUsersToDelete = [...unpaidToDelete, ...paidToDelete];

    let deletedCount = 0;

    // delete each user and all their associated data
    for (const user of allUsersToDelete) {
        try {
            console.log(`Deleting user ${user.id} (${user.email})`);

            // delete user cascade (will delete reports, summaries, audit_logs via FK)
            const { error: deleteError } = await supabaseAdmin
                .from("users")
                .delete()
                .eq("id", user.id);

            if (deleteError) {
                console.error(`Error deleting user ${user.id}:`, deleteError);

                await logException(deleteError, {
                    component: "cronManager",
                    action: "deleteInactiveAccounts",
                });

                continue;
            }

            // delete auth user
            const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
                user.id
            );

            if (authError) {
                console.error(`Error deleting auth user ${user.id}:`, authError);
            }

            console.log(`✅ User ${user.id} deleted successfully`);
            deletedCount++;
        } catch (e) {
            console.error(`Failed to delete user ${user.id}:`, e);
            await logException(e, {
                component: "cronManager",
                action: "deleteInactiveAccounts",
            });
        }
    }

    console.log("=== DELETE INACTIVE ACCOUNTS COMPLETED ===");

    return {
        processed: allUsersToDelete.length,
        unpaidDeleted: unpaidToDelete.length,
        paidDeleted: paidToDelete.length,
        totalDeleted: deletedCount,
    };
}
import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { logAuditEvent } from "@/lib/auditLog";
import { logException } from "@/lib/errorLog";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    // verify cron secret
    const { secret } = req.query;

    if (secret !== process.env.CRON_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("=== DELETE INACTIVE ACCOUNTS CRON JOB STARTED ===");

    try {
        const now = new Date();
        
        // ✅ delete unpaid users inactive for 37+ days
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
                component: "deleteInactiveAccounts",
                action: "fetchUnpaidUsers",
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

        // ✅ delete paid users inactive for 60+ days
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
                component: "deleteInactiveAccounts",
                action: "fetchPaidUsers",
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
                        component: "deleteInactiveAccounts",
                        action: "deleteUser",
                        userId: user.id,
                    });

                    continue;
                }

                // delete auth user (Supabase will cascade to linked auth.users)
                const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
                    user.id
                );

                if (authError) {
                    console.error(`Error deleting auth user ${user.id}:`, authError);
                    // don't throw, just log - user record already deleted
                }

                console.log(`✅ User ${user.id} deleted successfully`);

                deletedCount++;
            } catch (e) {
                console.error(`Failed to delete user ${user.id}:`, e);

                await logException(e, {
                    component: "deleteInactiveAccounts",
                    action: "deleteUserLoop",
                    userId: user.id,
                });
            }
        }

        await logAuditEvent("accounts_deleted", null, {
            component: "deleteInactiveAccounts",
            unpaidDeleted: unpaidToDelete.length,
            paidDeleted: paidToDelete.length,
            totalDeleted: deletedCount,
        });

        console.log("=== DELETE INACTIVE ACCOUNTS COMPLETED ===");

        return res.status(200).json({
            success: true,
            message: "Inactive accounts deleted",
            unpaidDeleted: unpaidToDelete.length,
            paidDeleted: paidToDelete.length,
            totalDeleted: deletedCount,
        });
    } catch (e) {
        console.error("Error in delete inactive accounts:", e);

        await logException(e, {
            component: "deleteInactiveAccounts",
            action: "cronJobError",
        });

        return res.status(500).json({
            error: "Failed to delete inactive accounts",
            details: e instanceof Error ? e.message : "Unknown error",
        });
    }
}
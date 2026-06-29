import { supabaseAdmin } from "./supabaseServer";
import { logAuditEvent } from "./auditLog";
import type { EmailData } from "@/emails/utils/render-email";
import { queueEmailForUser, type EmailType } from "./emailQueue";

type Tier = "basic" | "standard" | "pro";

interface TierInfo {
    tier: Tier;
    limit: number | null;
}

const STANDARD_LIMIT = 15;
const BASIC_LIMIT = 5;

const STANDARD_PRICE_IDS = (process.env.STANDARD_PRICE_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

const PRO_PRICE_IDS = (process.env.PRO_PRICE_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

async function getUserTierAndLimit(userId: string): Promise<TierInfo> {
    const { data: subscription } = await supabaseAdmin
        .from("subscriptions")
        .select("price_id, status")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!subscription) {
        return { tier: "basic", limit: BASIC_LIMIT };
    }

    if (
        subscription.price_id &&
        PRO_PRICE_IDS.length > 0 &&
        PRO_PRICE_IDS.includes(subscription.price_id)
    ) {
        return { tier: "pro", limit: null };
    }

    if (
        subscription.price_id &&
        STANDARD_PRICE_IDS.length > 0 &&
        STANDARD_PRICE_IDS.includes(subscription.price_id)
    ) {
        return { tier: "standard", limit: STANDARD_LIMIT };
    }

    // default to basic/free for unknown or "basic" status rows
    return { tier: "basic", limit: BASIC_LIMIT };
}

async function getSummariesThisMonth(userId: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getUTCFullYear(), now.getUTCMonth(), 1);

    const { count, error } = await supabaseAdmin
        .from("summaries")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", startOfMonth.toISOString());
      
    if (error) {
        console.error("Error counting summaries this month: ", error);

        await logAuditEvent("error", userId, {
            component: "emailTriggers",
            action: "getSummariesThisMonth",
            error,
        });

        return 0;
    }

    return count || 0;
}

interface TriggerSummaryEmailsProps {
    userId: string;
    reportId: string;
    summaryId: string;
    generationTime: number;
}

/**
 * Triggers emails after a summary is generated:
 * - Sends "Summary Ready"
 * - Checks usage and sends warnings/limit emails per tier
 */
export async function triggerSummaryEmails({
    userId,
    reportId,
    summaryId,
    generationTime,
}: TriggerSummaryEmailsProps) {
    try {
        const [{ data: user, error: userError }, { data: report, error: reportError }, { data: summary, error: summaryError }] =
          await Promise.all([
              supabaseAdmin
                  .from("users")
                  .select("name, email")
                  .eq("id", userId)
                  .single(),
              supabaseAdmin
                  .from("reports")
                  .select("title")
                  .eq("id", reportId)
                  .single(),
              supabaseAdmin
                  .from("summaries")
                  .select("summary_struct")
                  .eq("id", summaryId)
                  .single(),
          ]);

        if (userError || !user) {
            throw userError || new Error("User not found");
        }

        if (reportError || !report) {
            throw reportError || new Error("Report not found");
        }

      if (summaryError || !summary) {
          throw summaryError || new Error("Summary not found");
      }

        const summaryStruct = summary.summary_struct as {
            summary: string;
            metrics?: string[];
            trends?: string[];
            recommendations?: string[];
        };

        const topMetric = summaryStruct.metrics?.[0] || "";
        const notableTrend = summaryStruct.trends?.[0] || "";

        const { tier, limit } = await getUserTierAndLimit(userId);
        const summariesThisMonth = await getSummariesThisMonth(userId);

        const reportsRemaining = limit !== null ? Math.max(0, limit - summariesThisMonth) : null;

        // queue Summary Ready email
        const summaryData: EmailData = {
            name: user.name || user.email || "",
            reportName: report.title || "Untitled report",
            reportId,
            topMetric,
            notableTrend,
            generationTime,
            reportsRemaining: reportsRemaining ?? undefined,
            reportsLimit: limit ?? undefined,
        };

        await queueEmailForUser({
            userId,
            emailType: "summary_ready",
            data: summaryData,
        });

        // usage warnings / limit emails (basic + standard only)
        if (limit !== null) {
            const warningThreshold = limit - 1;
            const limitThreshold = limit;

            let usageEmailType: EmailType | null = null;

            if (summariesThisMonth === warningThreshold) {
                usageEmailType = "usage_warning";
            } else if (summariesThisMonth === limitThreshold) {
                usageEmailType = "usage_limit";
            }

            if (usageEmailType) {
                const now = new Date();
                const nextMonth = new Date(
                    now.getUTCFullYear(),
                    now.getUTCMonth() + 1,
                    1
                );

                const usageData: EmailData = {
                    name: user.name || user.email || "",
                    reportsUsed: summariesThisMonth,
                    reportsLimit: limit,
                    resetDate: nextMonth.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }),
                };

                await queueEmailForUser({
                    userId,
                    emailType: usageEmailType,
                    data: usageData,
                });
            }
        }
    } catch (e) {
        console.error("Error in triggerSummaryEmails: ", e);

        await logAuditEvent("error", userId, {
            component: "emailTriggers",
            action: "triggerSummaryEmails",
            reportId,
            summaryId,
            error: e,
        });
    }
}

/**
 * Queue monthly reset emails for all users with monthly limits (basic + standard).
 * Intended to be called once per day from a cron job.
 */
export async function queueMonthlyResetEmails() {
    const now = new Date();

    // only run on the 1st of the month (UTC)
    if (now.getUTCDate() !== 1) {
        return { processed: 0 };
    }

    const { data: users, error } = await supabaseAdmin
        .from("users")
        .select("id, name, email, email_preferences(*)");

    if (error || !users) {
        await logAuditEvent("error", null, {
            component: "emailTriggers",
            action: "queueMonthlyResetEmails",
            error,
        });

        throw error || new Error("Failed to fetch users");
    }

    let processed = 0;

    for (const user of users) {
        const userId = user.id as string;

        const { tier, limit } = await getUserTierAndLimit(userId);

        if (limit === null) {
          
            // pro/unlimited – no reset email
            continue;
        }

        const currentMonth = now.toLocaleDateString("en-US", {
          month: "long",
        });

        const data: EmailData = {
            name: user.name || user.email || "",
            currentMonth,
            reportsLimit: limit,
            lastMonthReports: undefined,
        };

        try {
            await queueEmailForUser({
                userId,
                emailType: "monthly_reset",
                data,
            });

            processed++;
        } catch (e) {
            console.error("Failed to queue monthly reset email: ", e);

            await logAuditEvent("email_failed", userId, {
                component: "emailTriggers",
                action: "queueMonthlyResetEmails",
                error: e,
            });
        }
    }

    return { processed };
}

/**
 * Queue first report reminder emails for users who signed up 3 days ago
 * and have not uploaded any reports.
 */
export async function queueFirstReportReminders() {
    const now = new Date();

    const threeDaysAgo = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 3)
    );
    const startOfDay = new Date(
        threeDaysAgo.getUTCFullYear(),
        threeDaysAgo.getUTCMonth(),
        threeDaysAgo.getUTCDate()
    );
    const endOfDay = new Date(
        threeDaysAgo.getUTCFullYear(),
        threeDaysAgo.getUTCMonth(),
        threeDaysAgo.getUTCDate() + 1
    );

    const { data: users, error } = await supabaseAdmin
        .from("users")
        .select("id, name, email, first_login_at, email_preferences(*)")
        .gte("first_login_at", startOfDay.toISOString())
        .lt("first_login_at", endOfDay.toISOString());

    if (error || !users) {
        await logAuditEvent("error", null, {
            component: "emailTriggers",
            action: "queueFirstReportReminders",
            error,
        });

        throw error || new Error("Failed to fetch users for reminders");
    }

    let processed = 0;

    for (const user of users) {
        const userId = user.id as string;

        // skip if user has any reports
        const { count, error: reportsError } = await supabaseAdmin
            .from("reports")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId);

        if (reportsError) {
            await logAuditEvent("error", userId, {
                component: "emailTriggers",
                action: "checkReportsForFirstReminder",
                error: reportsError,
            });

            continue;
        }

        if ((count || 0) > 0) {
            continue;
        }

        const data: EmailData = {
            name: user.name || user.email || "",
        };

        try {
            await queueEmailForUser({
                userId,
                emailType: "first_report_reminder",
                data,
            });

            processed++;
        } catch (e) {
            console.error("Failed to queue first report reminder email: ", e);

            await logAuditEvent("email_failed", userId, {
                component: "emailTriggers",
                action: "queueFirstReportReminders",
                error: e,
            });
        }
    }

    return { processed };
}

/**
 * Queue inactive user re-engagement emails for users whose last login
 * (tracked via users.updated_at) was more than 30 days ago.
 */
export async function queueInactiveUserEmails() {
    const now = new Date();
    const thirtyDaysAgo = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 30)
    ).toISOString();

    const { data: users, error } = await supabaseAdmin
        .from("users")
        .select("id, name, email, updated_at, login_count, email_preferences(*)")
        .lt("updated_at", thirtyDaysAgo);

    if (error || !users) {
        await logAuditEvent("error", null, {
            component: "emailTriggers",
            action: "queueInactiveUserEmails",
            error,
        });

        throw error || new Error("Failed to fetch inactive users");
    }

    let processed = 0;

    for (const user of users) {
        const userId = user.id as string;

        if (!user.login_count || user.login_count <= 0) {
            continue;
        }

        const data: EmailData = {
            name: user.name || user.email || "",
        };

        try {
            await queueEmailForUser({
                userId,
                emailType: "inactive_user",
                data,
            });

            processed++;
        } catch (e) {
            console.error("Failed to queue inactive user email: ", e);

            await logAuditEvent("email_failed", userId, {
                component: "emailTriggers",
                action: "queueInactiveUserEmails",
                error: e,
            });
        }
    }

    return { processed };
}

/**
 * Queue account deletion warning emails for users inactive 30+ days.
 * Runs daily; sends once per user per month.
 */
export async function queueAccountDeletionWarningEmails() {
    const now = new Date();

    const freeCutoff = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - 30
    ));

    const paidCutoff = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - 60
    ));

    const scheduledDeletionAt = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 7
    ));

    const { data: users, error } = await supabaseAdmin
        .from("users")
        .select(`
            id,
            name,
            email,
            updated_at,
            scheduled_deletion_at,
            subscriptions(status, price_id, stripe_subscription_id)
        `)
        .is("scheduled_deletion_at", null);

    if (error || !users) {
        await logAuditEvent("error", null, {
            component: "emailTriggers",
            action: "queueAccountDeletionWarningEmails",
            error,
        });

        throw error || new Error("Failed to fetch users for deletion warnings");
    }

    let processed = 0;
    let freeWarnings = 0;
    let paidWarnings = 0;

    for (const user of users) {
        const userId = user.id as string;
        const updatedAt = new Date(user.updated_at as string);

        const subscriptions = Array.isArray(user.subscriptions)
            ? user.subscriptions
            : [];

        const isPaid = subscriptions.some((sub) =>
            sub.status === "active" &&
            Boolean(sub.stripe_subscription_id || sub.price_id)
        );

        const inactiveDays = isPaid ? 60 : 30;
        const cutoff = isPaid ? paidCutoff : freeCutoff;
        const deletionPolicy = isPaid ? "paid" : "free";

        if (updatedAt >= cutoff) {
            continue;
        }

        const data: EmailData = {
            name: user.name || user.email || "",
            inactiveDays,
            deletionDate: scheduledDeletionAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
        };

        try {
            const result = await queueEmailForUser({
                userId,
                emailType: "account_deletion_warning",
                data,
            });

            if (!result.queued) {
                continue;
            }

            const { error: updateError } = await supabaseAdmin
                .from("users")
                .update({
                    inactive_deletion_notice_sent_at: now.toISOString(),
                    scheduled_deletion_at: scheduledDeletionAt.toISOString(),
                    deletion_policy: deletionPolicy,
                })
                .eq("id", userId);

            if (updateError) {
                throw updateError;
            }

            processed++;

            if (isPaid) {
                paidWarnings++;
            } else {
                freeWarnings++;
            }
        } catch (e) {
            console.error("Failed to queue account deletion warning email:", e);

            await logAuditEvent("email_failed", userId, {
                component: "emailTriggers",
                action: "queueAccountDeletionWarningEmails",
                error: e,
            });
        }
    }

    return {
        processed,
        freeWarnings,
        paidWarnings,
    };
}

/**
 * Queue account deletion warning emails for users inactive 30+ days.
 * Runs daily; sends once per user per month.
 */
export async function deleteMarkedInactiveAccounts() {
    const now = new Date();

    const { data: users, error } = await supabaseAdmin
        .from("users")
        .select("id, email, scheduled_deletion_at, deletion_notice_type")
        .not("scheduled_deletion_at", "is", null)
        .lte("scheduled_deletion_at", now.toISOString());

    if (error || !users) {
        await logAuditEvent("error", null, {
            component: "emailTriggers",
            action: "deleteMarkedInactiveAccounts",
            error,
        });

        throw error || new Error("Failed to fetch marked inactive users");
    }

    let deletedCount = 0;

    for (const user of users) {
        try {
            const { error: deleteUserError } = await supabaseAdmin
                .from("users")
                .delete()
                .eq("id", user.id);

            if (deleteUserError) {
                throw deleteUserError;
            }

            const { error: authError } =
                await supabaseAdmin.auth.admin.deleteUser(user.id);

            if (authError) {
                await logAuditEvent("error", user.id, {
                    component: "emailTriggers",
                    action: "deleteMarkedInactiveAccounts.authDelete",
                    error: authError,
                });
            }

            deletedCount++;
        } catch (e) {
            await logAuditEvent("error", user.id, {
                component: "emailTriggers",
                action: "deleteMarkedInactiveAccounts",
                error: e,
            });
        }
    }

    return {
        processed: users.length,
        deletedCount,
    };
}


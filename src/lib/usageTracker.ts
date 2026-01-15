import { supabase } from "./supabaseClient";
import { supabaseAdmin } from "./supabaseServer";

const FREE_TIER_LIMIT = 5

interface UsageStats {
    reportsThisMonth: number;
    limit: number;
    remaining: number;
    hasExceeded: boolean;
    resetDate: Date;
}

// get usage statistics
export async function getUserUsage(userId: string): Promise<UsageStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // count reports generated this month
    const { count, error } = await supabase
        .from("audit_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("event_type", "report_summarised")
        .gte("created_ad", startOfMonth.toISOString());

    if (error) {
        console.error("Error fetching usage: ", error);

        throw error;
    }

    const reportsThisMonth = count || 0;
    const remaining = Math.max(0, FREE_TIER_LIMIT - reportsThisMonth);
    const hasExceeded = reportsThisMonth >= FREE_TIER_LIMIT;
    
    return{
        reportsThisMonth,
        limit: FREE_TIER_LIMIT,
        remaining,
        hasExceeded,
        resetDate: nextMonth,
    };
}

    // chceck if user can generate a report
export async function canGenerateReport(userId: string): Promise<{
    allowed: boolean;
    reason?: string;
    usage?: UsageStats;
}> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // count reports generated this month
    const { count, error } = await supabaseAdmin
        .from("audit_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("event_type", "report_summarised")
        .gte("created_at", startOfMonth.toISOString());
    
    if (error) {
        console.error("Error checking usage: ", error);

        return{ allowed: false, reason: "Error chceking usage limit" };
    }

    const reportsThisMonth = count || 0;

    // check subscription status (future paid teirs)
    const { data: subscription } = await supabaseAdmin
        .from("subscriptions")
        .select("status")
        .eq("user_id", userId)
        .eq("status", "active")
        .single();

    if (subscription) {
        return { allowed: true };
    }

    // check free tier limit
    if (reportsThisMonth >= FREE_TIER_LIMIT) {
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        return {
            allowed: false,
            reason: `You have reached your free tier limit of ${FREE_TIER_LIMIT} reports per month. Limit resets on ${nextMonth.toLocaleDateString}.`,
            usage: {
                reportsThisMonth,
                limit: FREE_TIER_LIMIT,
                remaining: 0,
                hasExceeded: true,
                resetDate: nextMonth,
            },
        };
    }

    return { allowed: true };
}

// log a report
export async function logReportGeneration(
    userId: string,
    reportId: string,
    reportTitle: string
) {
    const { error } = await supabaseAdmin.from("audit_logs").insert({
        user_id: userId,
        event_type: "report_summarised",
        payload: {
            report_id: reportId,
            report_title: reportTitle,
            timestamp: new Date().toISOString(),
        },
    });

    if (error) {
        console.error("Error logging report generation: ", error);
    }
}
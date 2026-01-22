import { supabase } from "./supabaseClient";

const FREE_TIER_LIMIT = 5 // reports per month

interface UsageStats {
    reportsThisMonth: number;
    limit: number;
    remaining: number;
    hasExceeded: boolean;
    resetDate: Date;
}

// get usage statistics for the user
export async function getUserUsage(userId: string): Promise<UsageStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // count reports generated this month
    const { count, error } = await supabase
        .from("audit_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("event_type", "report_summarized")
        .gte("created_at", startOfMonth.toISOString());

    if (error) {
        console.error("Error fetching usage: ", error);

        // return zero usage on error rather than thowing

        return {
            reportsThisMonth: 0,
            limit: FREE_TIER_LIMIT,
            remaining: FREE_TIER_LIMIT,
            hasExceeded: false,
            resetDate: nextMonth
        }
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
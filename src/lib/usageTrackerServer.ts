import { supabaseAdmin } from "./supabaseServer";

const FREE_TIER_LIMIT = 5; // AI analyses per month

interface UsageStats {
    reportsThisMonth: number;
    limit: number;
    remaining: number;
    hasExceeded: boolean;
    resetDate: Date;
}

// check if user can generate a report (AI analysis)
export async function canGenerateReport(userId: string): Promise<{
    allowed: boolean;
    reason?: string;
    usage?: UsageStats;
}> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // count summaries created this month
    const { count, error } = await supabaseAdmin
        .from("summaries")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", startOfMonth.toISOString());
    
    if (error) {
        console.error("Error checking usage:", error);
        return { allowed: false, reason: "Error checking usage limit" };
    }

    const reportsThisMonth = count || 0;

    // check subscription status (future paid tiers)
    const { data: subscription } = await supabaseAdmin
        .from("subscriptions")
        .select("status, price_id")
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();

    if (subscription) {

        // TODO: Check subscription tier and return appropriate limit
        return { allowed: true };
    }

    // check free tier limit
    if (reportsThisMonth >= FREE_TIER_LIMIT) {
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        return {
            allowed: false,
            reason: `You have reached your free tier limit of ${FREE_TIER_LIMIT} AI analyses per month. Limit resets on ${nextMonth.toLocaleDateString()}.`,
            usage: {
                reportsThisMonth,
                limit: FREE_TIER_LIMIT,
                remaining: 0,
                hasExceeded: true,
                resetDate: nextMonth,
            },
        };
    }

    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    return { 
        allowed: true,
        usage: {
            reportsThisMonth,
            limit: FREE_TIER_LIMIT,
            remaining: FREE_TIER_LIMIT - reportsThisMonth,
            hasExceeded: false,
            resetDate: nextMonth,
        }
    };
}
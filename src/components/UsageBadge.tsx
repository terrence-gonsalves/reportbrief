import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getUserUsage } from "@/lib/usageTracker";
import { logException } from "@/lib/errorLog";

export default function UsageBadge() {
    const [usage, setUsage] = useState<{
        remaining: number;
        limit: number;
        hasExceeded: boolean;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsage();
    }, []);

    const loadUsage = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            const stats = await getUserUsage(user.id);

            setUsage({
                remaining: stats.remaining,
                limit: stats.limit,
                hasExceeded: stats.hasExceeded,
            });
        } catch (e) {
            await logException(e, {
                component: "UsageBadge",
                action: "loadUsage",
            });

            console.error("Failed to load usage: ", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !usage) return null;

    return(
        <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                usage.hasExceeded
                    ? "bg-red-100 text-red-800"
                    : usage.remaining <= 1
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                }`
            }
        >
      
        {usage.hasExceeded ? (
            <>
                <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                    />
                </svg>
                
                Limit reached
            </>
        ) : (
            <>
          
                {usage.remaining} of {usage.limit} free reports remaining
            </>
        )}
        </div>
    );
}
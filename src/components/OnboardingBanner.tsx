import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function OnboardingBanner() {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkIfFirstTime();
    }, []);

    const checkIfFirstTime = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            // check if the user has any reports
            const { count } = await supabase
                .from("reports")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user.id);

            // check ig banner was already dismiised
            const dismissed = localStorage.getItem("onboarding_dismissed");


            //show banner only if there are no reports and not dimissed
            if (count === 0 && !dismissed) {
                setShow(true);
            }
        } catch (e) {
            console.error("Error checking first-time status: ", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDismiss = () => {
        localStorage.setItem("onboarding_dismissed", "true");
        setShow(false);

        fetch("/api/log-events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                eventType: "onboarding_dimissed",
                payload: {},
            }),
        }).catch(e => console.error("Failed to log dimisseal: ", e));
    };

    if (loading || !show) return null;

    return (
        <div className="bg-linear-to-r from-blue-600 to-blue-700 border-b border-blue-800">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-start space-x-3">
                            <div className="shrink-0 mt-0.5">
                                <svg
                                    className="h-6 w-6 text-blue-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-white mb-1">
                                    👋 Welcome to ReportBrief!
                                </h3>

                                <p className="text-sm text-blue-100 mb-3">
                                    Get started in 3 easy steps: Export your Salesforce report as CSV → 
                                    Upload it here → Generate AI-powered insights in seconds.
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href="/upload"
                                        className="inline-flex items-center px-4 py-2 bg-white text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        Upload Your First Report
                                        <svg
                                            className="ml-2 h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            />
                                        </svg>
                                    </Link>
                                    <Link
                                        href="/docs"
                                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-400 transition-colors"
                                    >
                                        View Documentation
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleDismiss}
                        className="shrink-0 ml-4 text-blue-200 hover:text-white transition-colors"
                        aria-label="Dismiss"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
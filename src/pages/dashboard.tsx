import { useEffect, useState, useCallback } from "react";
import Link from "next/link";   
import { supabase } from "@/lib/supabaseClient";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import UsageBadge from "@/components/UsageBadge";
import { logException } from "@/lib/errorLog";

interface Report {
    id: string;
    title: string;
    num_rows: number;
    columns: string[];
    status: string;
    uploaded_at: string;
    summary_id: string | null;
}

type SortOption = "newest" | "oldest" | "summarized" | "pending";

function Dashboard() {
    const [reports, setReports] = useState<Report[]>([]);
    const [filteredReports, setFilteredReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("newest");

    const logEvent = async (eventType: string, payload: Record<string, unknown>) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) return; 

            await fetch("/api/log-events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ eventType, payload }),
            });
        } catch (e) {  
            console.error("Failed to log event: ", e); 
        }
    }

    useEffect(() => {
        loadReports();
    }, []);

    const filterAndSortReports = useCallback(() => {
        let filtered = [...reports];

        // apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLocaleLowerCase();
            
            filtered = filtered.filter(report => 
                report.title.toLocaleLowerCase().includes(query)
            );
        }

        // apply sort
        switch (sortBy) {
            case "newest":
                filtered.sort((a, b) =>
                    new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
                );

                break;
            case "oldest":
                filtered.sort((a, b) =>
                    new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime()
                );

                break;
            case "summarized":
                filtered = filtered.filter(r => r.status === "summarized");
                filtered.sort((a, b) =>
                    new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
                );

                break;
            case "pending":
                filtered = filtered.filter(r => r.status === "parsed");
                filtered.sort((a, b) =>
                    new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
                );

                break;
        }

        setFilteredReports(filtered);
    }, [reports, searchQuery, sortBy]);

    useEffect(() => {
        filterAndSortReports();
    }, [filterAndSortReports]);

    const loadReports = async () => {
        try {
            setLoading(true);
            setError("");

            const { data, error: fetchError } = await supabase
                .from("reports")
                .select("*")
                .order("uploaded_at", { ascending: false });
            
            if (fetchError) throw fetchError;

            setReports(data || []);

            // log Dashboard view
            await logEvent("dashboard_viewed", {
                report_count: data?.length || 0,
            });
        } catch (e: unknown) {
            await logException(e, {
                component: "Dashboard",
                action: "loadReports",
            });
            
            const errorMessage = e instanceof Error ? e.message : "Failed to load reports";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);

        // log search
        if (query.length >= 3) {
            logEvent("dashboard_search", { query_length: query.length });
        }
    };

    const handleSortChange = (newSort: SortOption) => {
        setSortBy(newSort);

        // log sort change
        logEvent("dashboard_sorted", { sortBy: newSort });
    };

    const getStatusColour = (status: string) => {
        switch (status) {
            case "summarized":
                return "bg-green-100 text-green-800";
            case "parsed":
                return "bg-yellow-100 text-yellow-800";
            case "failed":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "summarized":
                return "✓";
            case "parsed":
                return "⋯";
            case "failed":
                return "✕";
            default:
                return "○";
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your reports...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Dashboard
                            </h1>

                            <p className="text-gray-600">
                                View and manage your report summaries
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <UsageBadge />
                    
                            <Link
                                href="/upload"
                                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 font-medium"
                            >
                                + New Report
                            </Link>
                        </div>
                    </div>
                    
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {reports.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search reports by name..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <svg
                                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            
                            <div className="md:w-64">
                                <select
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="summarized">Summarized Only</option>
                                    <option value="pending">Pending Only</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="mt-3 text-sm text-gray-600">
                            Showing {filteredReports.length} of {reports.length} reports
                            {searchQuery && ` matching "${searchQuery}"`}
                        </div>
                    </div>
                )}

                {!loading && reports.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                        
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                No reports yet
                            </h2>

                            <p className="text-gray-600 mb-6">
                                Upload your first Salesforce CSV report to get started with AI-powered insights.
                            </p>
                        
                            <Link
                                href="/upload"
                                className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 font-medium"
                            >
                                Upload Your First Report
                            </Link>
                        </div>
                    </div>
                )}

                {!loading && reports.length > 0 && filteredReports.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>

                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                No matching reports
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Try adjusting your search or filter criteria
                            </p>

                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSortBy("newest");
                                }}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Clear filters
                            </button>
                        </div>
                    </div>
                )}
                
                {filteredReports.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Report
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Data
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Uploaded
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                    
                                {filteredReports.map((report) => (
                                    <tr
                                        key={report.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <svg
                                                        className="h-5 w-5 text-blue-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {report.title}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {report.num_rows.toLocaleString()} rows
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {report.columns.length} columns
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColour(
                                                    report.status
                                                )}`}
                                            >
                                                <span className="mr-1">{getStatusIcon(report.status)}</span>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(report.uploaded_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/report/${report.id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                {report.status === "summarized" ? "View Summary" : "View Report"}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {reports.length > 0 && (
                    <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Reports</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {reports.length}
                                </p>
                            </div>
                            <div>                        
                                <p className="text-sm text-gray-600 mb-1">Summarised</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {reports.filter((r) => r.status === "summarized").length}
                                </p>
                        
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {reports.filter((r) => r.status === "parsed").length}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                </div>
            </div>
        </Layout>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    );
}

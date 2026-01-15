import { useState, useRef, DragEvent } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import UsageBadge from "@/components/UsageBadge";

function Upload() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string>("");
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];

            if (droppedFile.name.endsWith(".csv")) {
                setFile(droppedFile);
                setError("");
            } else {
                setError("Please upload a CSV file");
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            if (selectedFile.name.endsWith(".csv")) {
                setFile(selectedFile);
                setError("");
            } else {
                setError("Please upload a CSV file");
            }
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError("Please select a file");

            return;
        }

        setUploading(true);
        setError("");

        try {

            // get current user session
            const { data: { session }, error: authError } = await supabase.auth.getSession();

            if (authError || !session) {
                setError("You must be logged in to upload reports");
                setUploading(false);

                // redirect to login
                router.push("/login");
                
                return;
            }

            // create form data
            const formData = new FormData();
            formData.append("file", file);

            // upload with tokeen
            const res = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                },
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Upload failed");
            }

            router.push(`/report/${data.reportId}`);
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : "Upload failed";
            console.error("Upload error: ", errorMessage);

            setError(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Layout>
            <main className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Upload Salesforce Report
                    </h1>

                    <p className="text-gray-600 mb-8">
                        Upload a CSV export from Salesforce to get AI-powered insights
                    </p>

                    <div className="mb-4">
                        <UsageBadge />
                    </div>                    
                    <div
                        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                            dragActive
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 bg-white"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                    {!file ? (
                        <>
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>

                            <p className="text-gray-600 mb-2">
                                Drag and drop your CSV file here, or
                            </p>

                            <button
                                onClick={() => inputRef.current?.click()}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                browse files
                            </button>

                            <p className="text-sm text-gray-500 mt-2">CSV files only</p>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-center space-x-2">
                                <svg
                                    className="h-8 w-8 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span className="text-gray-700 font-medium">{file.name}</span>
                            </div>

                            <p className="text-sm text-gray-500">
                                {(file.size / 1024).toFixed(2)} KB
                            </p>

                            <button
                                onClick={() => setFile(null)}
                                className="text-red-600 hover:text-red-700 text-sm"
                            >
                                Remove file
                            </button>
                        </div>
                    )}
                    </div>
                    
                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}
                
                    <button
                        onClick={handleSubmit}
                        disabled={!file || uploading}
                        className={`mt-6 w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                            !file || uploading
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-black text-white hover:bg-gray-800"
                        }`}
                    >
                        {uploading ? "Uploading..." : "Upload & Analyze"}
                    </button>
                    
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-2">
                            What you will get:
                        </h3>

                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Executive summary of your report</li>
                            <li>• Key metrics and insights</li>
                            <li>• Trend analysis</li>
                            <li>• Actionable recommendations</li>
                            <li>• Downloadable PDF summary</li>
                        </ul>
                    </div>
                </div>
            </main>
        </Layout>
    );
}

export default function UploadPage() {
    return (
        <ProtectedRoute>
            <Upload />
        </ProtectedRoute>
    )
}
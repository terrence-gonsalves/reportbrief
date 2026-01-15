import { useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";

export default function Login() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleMagicLink = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: email,
                options: {
                    emailRedirectTo: `${window.location.origin}/upload`,
                },
            });

            if (error) throw error;

            setMessage("Check your email! We have sent you a magic link to sign in.");
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : "Login failed";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout simpleHeader={true}>
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                        Sign in to your account
                    </h2>

                    <p className="mt-2 text-center text-sm text-gray-600">
                        We have sent you a magic link to sign in.
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
                    {message ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex">
                                <svg
                                    className="h-5 w-5 text-green-400"
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

                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-800">
                                        Check your email!
                                    </h3>

                                    <div className="mt-2 text-sm text-green-700">
                                        <p>{message}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleMagicLink} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email address
                                </label>

                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                                        loading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                    }`}
                                >

                                    {loading ? "Sending magic link..." : "Send magic link"}
                                </button>
                            </div>
                        </form>
                    )}

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        No passwords required
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                By signing in, you agree to our{" "}
                                <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                                    Terms
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { supabase } from "@/lib/supabaseClient";

export default function Pricing() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsLoggedIn(!!session);
        });
    }, []);

    const handleGetStarted = (plan: string) => {
        if (!isLoggedIn) {
            router.push("/login");

            return;
        }

        if (plan === "basic") {
            router.push("/dashboard");
        } else {

            // for paid plans - display coming soon message for now
            alert("Paid plans coming soon! We'll notify you when they're available.");
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Simple, Transparent Pricing
                        </h1>
            
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Choose the plan that&apos;s right for you. Cancel anytime, no questions asked.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-8 flex flex-col">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
                
                                <div className="flex items-baseline mb-4">
                                    <span className="text-5xl font-bold text-gray-900">$0</span>
                                    <span className="text-gray-600 ml-2">/month</span>
                                </div>
                
                                <p className="text-gray-600">Perfect for trying out ReportBrief</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                
                                    <span className="text-gray-700">5 AI summaries per month</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>

                                    <span className="text-gray-700">CSV upload & analysis</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>

                                    <span className="text-gray-700">PDF export</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>

                                    <span className="text-gray-700">Dashboard access</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>

                                    <span className="text-gray-700">Email support</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => handleGetStarted("basic")}
                                className="w-full py-3 px-6 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                            >
                                {isLoggedIn ? "Current Plan" : "Get Started Free"}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-3">Free forever</p>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-lg border-2 border-blue-600 p-8 flex flex-col relative">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </span>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Standard</h3>

                                <div className="flex items-baseline mb-4">
                                    <span className="text-5xl font-bold text-gray-900">$19</span>
                                    <span className="text-gray-600 ml-2">/month</span>
                                </div>

                                <p className="text-gray-600">For regular Salesforce users</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-blue-600 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>

                                    <span className="text-gray-700"><strong>15 AI summaries per month</strong></span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-blue-600 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>

                                    <span className="text-gray-700">Everything in Basic</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-blue-600 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>

                                    <span className="text-gray-700">Priority email support</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-blue-600 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>

                                    <span className="text-gray-700">Advanced analytics</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-blue-600 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>

                                    <span className="text-gray-700">Custom branding on PDFs</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => handleGetStarted("standard")}
                                className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                            >
                                Coming Soon
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-3">Cancel anytime</p>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-8 flex flex-col">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                
                                <div className="flex items-baseline mb-4">
                                    <span className="text-5xl font-bold text-gray-900">$49</span>
                                    <span className="text-gray-600 ml-2">/month</span>
                                </div>
                
                                <p className="text-gray-600">For power users and teams</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-purple-600 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>

                                    <span className="text-gray-700"><strong>Unlimited AI summaries</strong></span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-purple-600 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>

                                    <span className="text-gray-700">Everything in Standard</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-purple-600 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>

                                    <span className="text-gray-700">Priority support (24h response)</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-purple-600 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>

                                    <span className="text-gray-700">API access (coming soon)</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-purple-600 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>

                                    <span className="text-gray-700">Team collaboration features</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => handleGetStarted("pro")}
                                className="w-full py-3 px-6 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                            >
                                Coming Soon
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-3">Cancel anytime</p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            Frequently Asked Questions
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Can I cancel anytime?
                                </h4>

                                <p className="text-gray-700">
                                    Yes! All plans can be cancelled at any time with no penalties or fees. 
                                    Your plan will remain active until the end of your current billing period.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    What happens if I exceed my limit?
                                </h4>

                                <p className="text-gray-700">
                                    You&apos;ll be notified when you&apos;re approaching your limit. You can upgrade 
                                    to a higher tier anytime, or wait until your limit resets on the 1st of each month.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Do you offer refunds?
                                </h4>

                                <p className="text-gray-700">
                                    Yes, we offer a 14-day money-back guarantee on all paid plans. 
                                    If you&apos;re not satisfied, contact us for a full refund.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Can I change plans?
                                </h4>

                                <p className="text-gray-700">
                                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect 
                                    immediately, and we&apos;ll prorate the charges accordingly.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Is my data secure?
                                </h4>

                                <p className="text-gray-700">
                                    Absolutely. All data is encrypted in transit and at rest. We never share 
                                    your data with third parties. See our{" "}
                                    <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                                        Privacy Policy
                                    </Link>{" "}
                                    for details.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Do you offer team plans?
                                </h4>

                                <p className="text-gray-700">
                                    Team plans are coming soon! Contact us at{" "}
                                    <a href="mailto:support@reportbrief.com" className="text-blue-600 hover:text-blue-700">
                                        support@reportbrief.com
                                    </a>{" "}
                                    if you&apos;re interested.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-lg p-12 text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to transform your Salesforce reports?
                        </h2>

                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Start with our free plan today. No credit card required.
                        </p>

                        <button
                            onClick={() => handleGetStarted("basic")}
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 font-medium transition-colors"
                        >
                            {isLoggedIn ? "Go to Dashboard" : "Get Started Free"}
                        </button>
                    </div>
                    
                    <div className="mt-8 text-center">
                        <Link href="/" className="text-blue-600 hover:text-blue-700">
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
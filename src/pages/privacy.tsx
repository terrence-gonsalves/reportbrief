import Link from "next/link";

export default function Privacy() {
    return(
        <div className="min-h-screen bg-gray-50">
            <header className="border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">RB</span>
                        </div>

                        <span className="text-xl font-bold text-gray-900">ReportBrief</span>
                    </Link>
                </div>
            </header>
            
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Privacy Policy
                </h1>

                <p className="text-gray-600 mb-8">
                    Last updated: December 21, 2025
                </p>

                <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            1. Introduction
                        </h2>

                        <p className="text-gray-700 leading-relaxed">
                            ReportBrief (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy 
                            explains how we collect, use, disclose, and safeguard your information when you use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            2. Information We Collect
                        </h2>
                        
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-4">
                            Account Information
                        </h3>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            When you create an account, we collect:
                        </p>

                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Email address</li>
                            <li>Account creation date</li>
                            <li>Usage statistics (number of reports processed, features used)</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-4">
                            Uploaded Data
                        </h3>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            When you upload CSV files, we temporarily process:
                        </p>

                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>File contents (Salesforce report data)</li>
                            <li>File metadata (name, size, upload date)</li>
                            <li>Sample rows for AI analysis</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-4">
                            Automatically Collected Information
                        </h3>

                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Browser type and version</li>
                            <li>Device information</li>
                            <li>IP address</li>
                            <li>Usage patterns and analytics</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            3. How We Use Your Information
                        </h2>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            We use your information to:
                        </p>

                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Provide and maintain the Service</li>
                            <li>Process your CSV files and generate AI summaries</li>
                            <li>Send you service-related communications</li>
                            <li>Improve and optimize the Service</li>
                            <li>Detect and prevent fraud or abuse</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            4. Data Processing and AI
                        </h2>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            Your uploaded CSV data is processed using third-party AI services (Anthropic Claude API). 
                            Here&apos;s what you should know:
                        </p>

                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Data is sent to Anthropic&apos;s API for analysis</li>
                            <li>Anthropic does not train on your data or retain it after processing</li>
                            <li>Sample rows (up to 50) are stored temporarily for summary generation</li>
                            <li>Complete CSV files are not permanently stored on our servers</li>
                            <li>Generated summaries are stored in your account</li>
                        </ul>
                    </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            5. Data Retention
                            </h2>

                            <p className="text-gray-700 leading-relaxed mb-4">
                                We retain your data as follows:
                            </p>

                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li><strong>Account data:</strong> Until you delete your account</li>
                                <li><strong>Generated summaries:</strong> Until you delete them or close your account</li>
                                <li><strong>Sample CSV rows:</strong> Stored with summaries for reference</li>
                                <li><strong>Full CSV files:</strong> Not permanently stored (processed and discarded)</li>
                            </ul>
                        </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            6. Data Sharing and Disclosure
                        </h2>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            We do not sell your data. We may share your information only in these cases:
                        </p>

                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li><strong>Service Providers:</strong> Anthropic (AI), Supabase (database), Vercel (hosting)</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            7. Data Security
                        </h2>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            We implement security measures to protect your data:
                        </p>

                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Data encryption in transit (HTTPS/TLS)</li>
                            <li>Data encryption at rest</li>
                            <li>Access controls and authentication</li>
                            <li>Regular security audits</li>
                        </ul>

                        <p className="text-gray-700 leading-relaxed mt-4">
                            However, no method of transmission over the Internet is 100% secure. We cannot guarantee 
                            absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            8. Your Rights
                        </h2>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            You have the right to:
                        </p>

                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li><strong>Access:</strong> Request a copy of your data</li>
                            <li><strong>Correction:</strong> Update inaccurate information</li>
                            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                            <li><strong>Export:</strong> Download your generated summaries</li>
                            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                        </ul>

                        <p className="text-gray-700 leading-relaxed mt-4">
                            To exercise these rights, contact us at privacy@reportbrief.com
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            9. Cookies and Tracking
                        </h2>

                        <p className="text-gray-700 leading-relaxed">
                            We use essential cookies for authentication and session management. We may use analytics 
                            cookies to understand how users interact with our Service. You can control cookies through 
                            your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            10. Children&apos;s Privacy
                        </h2>

                        <p className="text-gray-700 leading-relaxed">
                            ReportBrief is not intended for children under 13. We do not knowingly collect information 
                            from children under 13. If you believe we have collected such information, please contact us 
                            immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            11. International Data Transfers
                        </h2>

                        <p className="text-gray-700 leading-relaxed">
                            Your data may be transferred to and processed in countries other than your own. We ensure 
                            appropriate safeguards are in place for such transfers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            12. Changes to Privacy Policy
                        </h2>

                        <p className="text-gray-700 leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of material changes 
                            via email or through the Service. Your continued use after changes constitutes acceptance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            13. Contact Us
                        </h2>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you have questions about this Privacy Policy or our data practices, contact us:
                        </p>
                        <p className="text-gray-700">
                            Email: <a href="mailto:privacy@reportbrief.com" className="text-blue-600 hover:text-blue-700">privacy@reportbrief.com</a>
                        </p>
                    </section>
                    </div>

                    <div className="mt-8 text-center">
                        <Link href="/" className="text-blue-600 hover:text-blue-700">
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
    );
}
import Link from "next/link";

export default function Tersm() {
    return (
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
                    Terms of Service
                </h1>

                <p className="text-gray-600 mb-8">
                    Last updated: December 21, 2025
                </p>

                <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            1. Agreement to Terms
                        </h2>

                        <p className="text-gray-700 leading-relaxed">
                            By accessing or using ReportBrief (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). 
                            If you disagree with any part of the terms, you may not access the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            2. Description of Service
                        </h2>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            ReportBrief is a software-as-a-service platform that analyzes Salesforce CSV reports and generates 
                            AI-powered summaries, insights, and recommendations.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            The Service uses artificial intelligence to analyze your data. While we strive for accuracy, 
                            AI-generated insights should be reviewed and verified before making business decisions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            3. User Accounts
                        </h2>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            You are responsible for:
                        </p>

                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Maintaining the security of your account</li>
                            <li>All activities that occur under your account</li>
                            <li>Notifying us immediately of any unauthorized use</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            4. Acceptable Use
                        </h2>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            You agree not to:
                        </p>

                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Upload malicious files or code</li>
                            <li>Attempt to bypass usage limits or restrictions</li>
                            <li>Reverse engineer or attempt to extract source code</li>
                            <li>Use the Service for any illegal purposes</li>
                            <li>Share your account credentials with others</li>
                            <li>Upload data you don&apos;t have permission to use</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            5. Data and Privacy
                        </h2>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            Your use of ReportBrief is also governed by our Privacy Policy. By using the Service, 
                            you consent to our collection and use of data as described in the Privacy Policy.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            You retain all rights to your data. We process your data solely to provide the Service 
                            and do not sell or share your data with third parties except as required by law.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            6. Subscription and Payment
                        </h2>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            Some features of the Service require a paid subscription. By subscribing, you agree to:
                        </p>

                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Provide accurate billing information</li>
                            <li>Pay all fees associated with your subscription</li>
                            <li>Understand that subscriptions automatically renew unless cancelled</li>
                            <li>Cancellations take effect at the end of the current billing period</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            7. Refunds
                        </h2>

                        <p className="text-gray-700 leading-relaxed">
                            We offer refunds within 14 days of purchase if you are not satisfied with the Service. 
                            Contact us at support@reportbrief.com to request a refund.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            8. Disclaimers and Limitations
                        </h2>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:
                        </p>

                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>The accuracy or completeness of AI-generated insights</li>
                            <li>Uninterrupted or error-free operation</li>
                            <li>That the Service will meet your specific requirements</li>
                        </ul>

                        <p className="text-gray-700 leading-relaxed mt-4">
                            We are not liable for any business decisions made based on AI-generated insights. 
                            You should verify all information before taking action.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            9. Termination
                        </h2>

                        <p className="text-gray-700 leading-relaxed">
                            We may terminate or suspend your account immediately, without prior notice, for any breach 
                            of these Terms. Upon termination, your right to use the Service will cease immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            10. Changes to Terms
                        </h2>

                        <p className="text-gray-700 leading-relaxed">
                            We reserve the right to modify these Terms at any time. We will notify users of any 
                            material changes via email. Your continued use of the Service after changes constitutes 
                            acceptance of the new Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            11. Contact Us
                        </h2>

                        <p className="text-gray-700 leading-relaxed">
                            If you have any questions about these Terms, please contact us at:
                        </p>
                        <p className="text-gray-700 mt-4">
                            Email: <a href="mailto:support@reportbrief.com" className="text-blue-600 hover:text-blue-700">support@reportbrief.com</a>
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
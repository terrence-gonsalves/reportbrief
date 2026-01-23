import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/next';

export default function Docs() {
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
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Documentation
                        </h1>
                            
                        <p className="text-xl text-gray-600">
                            Everything you need to know about using ReportBrief
                        </p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Quick Start Guide
                        </h2>
            
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    1. Export Your Salesforce Report
                                </h3>
                
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Go to your Salesforce Reports tab</li>
                                    <li>Open the report you want to analyze</li>
                                    <li>Click &ldquo;Export&ldquo; and select &ldquo;CSV&ldquo; format</li>
                                    <li>Save the file to your computer</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    2. Upload to ReportBrief
                                </h3>

                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>
                                        <Link href="/login" className="text-blue-600 hover:text-blue-700">
                                            Sign in
                                        </Link>{" "}
                                        to your account (or create one - it&apos;s free!)
                                    </li>
                                    <li>Click &ldquo;Upload&ldquo; or drag & drop your CSV file</li>
                                    <li>Wait a few seconds while we process your data</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    3. Generate AI Summary
                                </h3>
                        
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Click &ldquo;Generate AI Summary&ldquo; on your report page</li>
                                    <li>Our AI analyzes your data in ~10 seconds</li>
                                    <li>View your executive summary, metrics, trends, and recommendations</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    4. Download & Share
                                </h3>
                        
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Download your summary as a PDF</li>
                                    <li>Share with your team or stakeholders</li>
                                    <li>Access all past reports from your Dashboard</li>
                                </ul>
                            </div>
                        </div>
                    </div>
            
                    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            What Does ReportBrief Analyze?
                        </h2>

                        <div className="space-y-4 text-gray-700">
                            <p>ReportBrief uses AI to analyze your Salesforce CSV reports and generates four key deliverables:</p>

                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-2">📄 Executive Summary</h4>
                                    <p className="text-sm">A concise overview of your data perfect for stakeholder updates</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-2">📊 Key Metrics</h4>
                                    <p className="text-sm">The most important numbers and KPIs at a glance</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-2">📈 Notable Trends</h4>
                                    <p className="text-sm">Patterns and anomalies you might have missed</p>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-2">💡 Recommendations</h4>
                                    <p className="text-sm">Actionable next steps based on your data</p>
                                </div>
                            </div>
                        </div>
                    </div>
            
                    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Supported Report Types
                        </h2>
                        
                        <p className="text-gray-700 mb-4">
                            ReportBrief works with any CSV file exported from Salesforce, including:
                        </p>

                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Opportunity Reports (pipeline, forecasts, won/lost analysis)</li>
                            <li>Lead Reports (conversion rates, sources, status)</li>
                            <li>Account Reports (customer segments, health scores)</li>
                            <li>Case Reports (support tickets, resolution times)</li>
                            <li>Activity Reports (calls, emails, meetings)</li>
                            <li>Custom Reports (any custom objects or fields)</li>
                        </ul>

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-900">
                                <strong>Note:</strong> ReportBrief works with any CSV format, not just Salesforce! 
                                If you have reports from other systems (HubSpot, Google Analytics, Excel), they&apos;ll work too.
                            </p>
                        </div>
                    </div>
            
                    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Usage Limits & Pricing
                        </h2>

                        <div className="space-y-4">
                            <div className="p-4 border-l-4 border-green-500 bg-green-50">
                                <h4 className="font-semibold text-gray-900 mb-2">Free Tier</h4>
                                <p className="text-gray-700">5 AI-powered report summaries per month</p>
                            </div>

                            <p className="text-gray-700">
                                Your usage resets on the 1st of each month. You can track your remaining reports on your Dashboard.
                            </p>
                            <p className="text-sm text-gray-600">
                                Need more reports? Contact us about our Pro plan for unlimited summaries.
                            </p>
                        </div>
                    </div>
            
                    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Tips & Best Practices
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">✅ For Best Results:</h4>
                        
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Export reports with descriptive column names</li>
                                    <li>Include at least 10 rows of data for meaningful analysis</li>
                                    <li>Remove any sensitive data before uploading (if needed)</li>
                                    <li>Use consistent date formats in your reports</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">💡 Pro Tips:</h4>

                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Name your files descriptively (e.g., &ldquo;Q4_Pipeline_Report.csv&ldquo;)</li>
                                    <li>Generate summaries regularly to track trends over time</li>
                                    <li>Download PDFs for easy sharing with non-technical stakeholders</li>
                                    <li>Use the search feature on your Dashboard to find specific reports</li>
                                </ul>
                            </div>
                        </div>
                    </div>
            
                    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Troubleshooting
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    &ldquo;Upload failed&ldquo; error
                                </h4>
                        
                                <p className="text-gray-700">
                                    Make sure your file is in CSV format and is under 10MB. Try re-exporting from Salesforce.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    &ldquo;Cannot generate summary&ldquo; error
                                </h4>

                                <p className="text-gray-700">
                                    You may have reached your monthly limit. Check your usage on the Dashboard or wait until the 1st of next month.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Summary seems inaccurate
                                </h4>

                                <p className="text-gray-700">
                                    AI-generated summaries are based on the data provided. Always verify insights before making business decisions. 
                                    If data quality is poor, the summary will reflect that.
                                </p>
                            </div>
                        </div>
                    </div>
            
                    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                    
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Is my data secure?
                                </h4>
                        
                                <p className="text-gray-700">
                                    Yes. Your data is encrypted in transit and at rest. We only store a small sample 
                                    of rows needed for analysis. We never share your data with third parties.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    How long does analysis take?
                                </h4>
                        
                                <p className="text-gray-700">
                                    Most reports are analyzed in 5-10 seconds. Larger reports may take up to 30 seconds.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Can I delete my reports?
                                </h4>
                        
                                <p className="text-gray-700">
                                    Yes. You can delete reports from your Dashboard at any time. This action is permanent 
                                    and cannot be undone.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    What AI model do you use?
                                </h4>
                        
                                <p className="text-gray-700">
                                    We use Claude (by Anthropic), a state-of-the-art AI model trained to analyze 
                                    business data and generate actionable insights.
                                </p>
                            </div>
                        </div>
                    </div>
            
                    <div className="bg-blue-50 rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Need More Help?
                        </h2>

                        <p className="text-gray-700 mb-6">
                            Can&apos;t find what you&apos;re looking for? We&apos;re here to help!
                        </p>

                        <Link
                            href="/contact"
                            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 font-medium"
                        >
                            Contact Support
                        </Link>
                    </div>
            
                    <div className="mt-8 text-center">
                        <Link href="/" className="text-blue-600 hover:text-blue-700">
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
            <SpeedInsights />
            <Analytics />
        </div>
    )
}
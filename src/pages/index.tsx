import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {

    // check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      router.push("/upload");
    } else {
      router.push("login");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RB</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ReportBrief</span>
          </div>

          <nav className="flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <Link href="/upload" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                
                <button onClick={() => supabase.auth.signOut()} className="text-gray-600 hover:text-gray-900">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900">
                  Sign In
                </Link>
                <Link href="/login" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Turn Salesforce Reports into
            <span className="text-blue-600"> Executive Summaries</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            A lightweight AI-powered tool that transforms Salesforce reports into executive-ready summaries.
            Built for Salesforce admins, RevOps, and operators who need insights without manual analysis.
          </p>

          <button
            onClick={handleGetStarted}
            className="bg-black text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Get Started Free
          </button>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • 5 free reports per month
          </p>
        </div>
        
        <div className="mt-16 bg-linear-to-br from-gray-100 to-gray-200 rounded-xl shadow-2xl p-8 border border-gray-300">
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="h-20 bg-blue-100 rounded"></div>
                <div className="h-20 bg-green-100 rounded"></div>
                <div className="h-20 bg-purple-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What you&apos;ll get from every report
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload any Salesforce CSV and ReportBrief automatically generates four key deliverables
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Executive Summary
            </h3>

            <p className="text-sm text-gray-600">
              A concise overview perfect for stakeholder updates
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Key Metrics
            </h3>

            <p className="text-sm text-gray-600">
              The most important numbers at a glance
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Notable Trends
            </h3>

            <p className="text-sm text-gray-600">
              Patterns and anomalies you might have missed
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Recommendations
            </h3>

            <p className="text-sm text-gray-600">
              Actionable next steps based on your data
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Lightning Fast
            </h3>

            <p className="text-gray-600">
              Get your complete analysis in under 10 seconds. No waiting, no setup.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
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
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Smart Insights
            </h3>

            <p className="text-gray-600">
              AI detects trends, anomalies, and opportunities you might miss in raw data.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Executive PDFs
            </h3>

            <p className="text-gray-600">
              Download beautiful, shareable PDF reports perfect for stakeholder meetings.
            </p>
          </div>
        </div>
      </section>
      
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Report
              </h3>
              <p className="text-gray-600">
                Export any report from Salesforce as CSV and drag it into ReportBrief
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI Analyzes
              </h3>
              <p className="text-gray-600">
                Our AI reads every row, identifies patterns, and extracts key insights
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Get Summary
              </h3>
              <p className="text-gray-600">
                Review insights, download PDF, or share with your team
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to stop wasting time on manual reporting?
          </h2>

          <p className="text-xl text-blue-100 mb-8">
            Join Salesforce teams who are already saving hours every week
          </p>

          <button
            onClick={handleGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Start Analyzing Reports Free
          </button>
        </div>
      </section>
      
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">RB</span>
              </div>
              <span className="text-sm text-gray-600">
                © 2025 ReportBrief. All rights reserved.
              </span>
            </div>
            
            <div className="flex space-x-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-gray-900">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-gray-900">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-gray-900">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
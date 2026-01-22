import Link from "next/link";
import { useState, FormEvent } from "react";
import Layout from "@/components/Layout";

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // just display a success message later we can integrate an email service
        setSubmitted(true);
    };

    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>

            <p className="text-xl text-gray-600">
              Have a question or feedback? We would love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Send us a message
              </h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-400 mt-0.5"
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
                      Message sent!
                    </h3>

                    <p className="mt-2 text-sm text-green-700">
                      Thanks for reaching out. We will get back to you within 24 hours.
                    </p>
                
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 text-sm text-green-800 hover:text-green-900 font-medium"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 font-medium"
                >
                  Send Message
                </button>
              </form>
            )}
            </div>
        
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Email Support
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">General Inquiries</p>

                    <a
                      href="mailto:support@reportbrief.com"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      support@reportbrief.com
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Privacy Questions</p>

                    <a
                      href="mailto:privacy@reportbrief.com"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      privacy@reportbrief.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Looking for help?
                </h3>
                <p className="text-blue-800 text-sm mb-4">
                  Check out our documentation and FAQs for quick answers to common questions.
                </p>
                <Link
                  href="/docs"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  View Documentation
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Response Time
                </h3>
                <p className="text-gray-700 mb-4">
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
                <p className="text-sm text-gray-600">
                  For urgent technical issues, please include &quot;[URGENT]&quot; in your subject line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
}
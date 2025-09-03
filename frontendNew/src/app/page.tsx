'use client';

import { useState, useEffect } from 'react';
import { EmailResponse, getAllEmails, getEmailSummary, EmailSummary } from '@/lib/api';
import { EmailResults } from '@/components/EmailResults';
import { ManualEmailInput } from '@/components/ManualEmailInput';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';

export default function Home() {
  const [emails, setEmails] = useState<EmailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<EmailSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'results' | 'analytics'>('results');

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const [emailsData, summaryData] = await Promise.all([
        getAllEmails(),
        getEmailSummary()
      ]);
      setEmails(emailsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to fetch emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailProcessed = (newEmail: EmailResponse) => {
    setEmails(prev => [newEmail, ...prev]);
    fetchEmails();
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">📧</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">Email Analysis System</h1>
                <p className="text-sm text-gray-600">ESP Detection & Receiving Chain Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">System Active</span>
              </div>
              <button
                onClick={fetchEmails}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Emails</p>
                <p className="text-3xl font-bold text-black">{summary?.totalEmails || 0}</p>
                <p className="text-xs text-gray-500 mt-1">All processed emails</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📧</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Processed</p>
                <p className="text-3xl font-bold text-black">{summary?.totalProcessed || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Successfully analyzed</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg Process Time</p>
                <p className="text-3xl font-bold text-black">{summary?.averageProcessingTime?.toFixed(0) || 0}ms</p>
                <p className="text-xs text-gray-500 mt-1">Processing speed</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">ESPs Detected</p>
                <p className="text-3xl font-bold text-black">
                  {summary?.espDistribution ? Object.keys(summary.espDistribution).length : 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Unique providers</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <span className="text-xl">🏢</span>
              </div>
            </div>
          </div>
        </div>

        {/* IMAP Monitor Info */}
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-black mb-2">IMAP Email Monitor</h3>
              <p className="text-gray-600 mb-1">Automatically monitoring Gmail inbox for new emails</p>
              <p className="text-sm text-gray-500">
                Send emails to your configured Gmail account and they will be automatically processed
              </p>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Monitoring Active</span>
            </div>
          </div>
        </div>

        {/* Manual Email Input */}
        <ManualEmailInput onEmailProcessed={handleEmailProcessed} />

        {/* Navigation Tabs */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'results'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              📧 Email Results
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              📊 Analytics
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'results' ? (
          <EmailResults emails={emails} loading={loading} />
        ) : (
          <AnalyticsDashboard emails={emails} loading={loading} />
        )}
      </main>
    </div>
  );
}
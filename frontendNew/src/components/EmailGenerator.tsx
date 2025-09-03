'use client';

import { GenerateEmailResponse } from '@/lib/api';
import { useState } from 'react';

interface EmailGeneratorProps {
  onGenerate: () => void;
  testEmail: GenerateEmailResponse | null;
  loading: boolean;
}

export const EmailGenerator = ({ onGenerate, testEmail, loading }: EmailGeneratorProps) => {
  const [copied, setCopied] = useState<'email' | 'subject' | null>(null);

  const copyToClipboard = async (text: string, type: 'email' | 'subject') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <button
          onClick={onGenerate}
          disabled={loading}
          className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center space-x-2 text-sm"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <span>⚡</span>
              <span>Generate Test Email</span>
            </>
          )}
        </button>
      </div>

      {testEmail && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h3 className="font-medium text-black mb-3 flex items-center text-sm">
              <span className="mr-2">📧</span>
              Generated Test Email
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Email Address:
                </label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-xs font-mono text-black">
                    {testEmail.email}
                  </code>
                  <button
                    onClick={() => copyToClipboard(testEmail.email, 'email')}
                    className="bg-black text-white px-2 py-1 rounded text-xs hover:bg-gray-800 transition-colors"
                  >
                    {copied === 'email' ? '✓' : '📋'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Subject Line:
                </label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-xs font-mono text-black">
                    {testEmail.subject}
                  </code>
                  <button
                    onClick={() => copyToClipboard(testEmail.subject, 'subject')}
                    className="bg-black text-white px-2 py-1 rounded text-xs hover:bg-gray-800 transition-colors"
                  >
                    {copied === 'subject' ? '✓' : '📋'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
              <p className="font-medium mb-1">Instructions:</p>
              <p>Send an email to the generated address with the exact subject line to test email routing and ESP detection.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

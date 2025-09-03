'use client';

import { useState } from 'react';
import { processEmail } from '@/lib/api';
import { EmailResponse } from '@/lib/api';

interface ManualEmailInputProps {
  onEmailProcessed: (email: EmailResponse) => void;
}

export const ManualEmailInput = ({ onEmailProcessed }: ManualEmailInputProps) => {
  const [rawEmail, setRawEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawEmail.trim() || !subject.trim()) {
      setError('Both raw email and subject are required');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const result = await processEmail({ rawEmail, subject });
      onEmailProcessed(result);
      setRawEmail('');
      setSubject('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process email');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-black">Manual Email Processing</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manually input email headers for analysis
            </p>
          </div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-black mb-2">
              Email Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              disabled={processing}
            />
          </div>
          
          <div>
            <label htmlFor="rawEmail" className="block text-sm font-medium text-black mb-2">
              Raw Email Headers
            </label>
            <textarea
              id="rawEmail"
              value={rawEmail}
              onChange={(e) => setRawEmail(e.target.value)}
              placeholder="Paste complete email headers including 'Received:' headers..."
              rows={8}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-vertical"
              disabled={processing}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={processing || !rawEmail.trim() || !subject.trim()}
            className="w-full bg-black text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {processing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Processing...
              </div>
            ) : (
              'Analyze Email'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

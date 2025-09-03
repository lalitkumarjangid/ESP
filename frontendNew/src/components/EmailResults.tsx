'use client';

import { EmailResponse } from '@/lib/api';
import { ESPBadge } from './ESPBadge';
import { ReceivingChain } from './ReceivingChain';
import { useState } from 'react';

interface EmailResultsProps {
  emails: EmailResponse[];
  loading: boolean;
}

export const EmailResults = ({ emails, loading }: EmailResultsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedESP, setSelectedESP] = useState('');
  const itemsPerPage = 20; // Show 20 emails per page

  // Filter emails based on search and ESP filter
  const filteredEmails = emails.filter(email => {
    const matchesSearch = searchTerm === '' || 
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.senderEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesESP = selectedESP === '' || email.espType === selectedESP;
    return matchesSearch && matchesESP;
  });

  // Paginate filtered results
  const totalPages = Math.ceil(filteredEmails.length / itemsPerPage);
  const paginatedEmails = filteredEmails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique ESPs for filter dropdown
  const uniqueESPs = Array.from(new Set(emails.map(email => email.espType)));
  
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-black">Analysis Results</h2>
          <p className="text-sm text-gray-600 mt-1">Processing email data...</p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black"></div>
            <span className="ml-3 text-gray-600 font-medium">Loading results...</span>
          </div>
        </div>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-black">Analysis Results</h2>
          <p className="text-sm text-gray-600 mt-1">No data available</p>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📭</span>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">No Emails Processed</h3>
            <p className="text-gray-600 text-sm">
              Generate or manually input email headers to see analysis results
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-black">Analysis Results</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredEmails.length} of {emails.length} emails
              {searchTerm || selectedESP ? ' (filtered)' : ''}
            </p>
          </div>
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search emails by subject or sender..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedESP}
              onChange={(e) => {
                setSelectedESP(e.target.value);
                setCurrentPage(1); // Reset to first page when filtering
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">All ESPs</option>
              {uniqueESPs.map(esp => (
                <option key={esp} value={esp}>{esp}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {paginatedEmails.map((email, index) => {
            const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
            return (
              <div
                key={email.id || index}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-600">#{globalIndex}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(email.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">Subject:</span> {email.subject}
                    </div>
                    {email.senderEmail && (
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">From:</span> {email.senderEmail}
                      </div>
                    )}
                  </div>
                  <ESPBadge espType={email.espType} />
                </div>
                
                <div className="mt-4">
                  <ReceivingChain chain={email.receivingChain} />
                </div>
                
                {email.metadata?.processingTime && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      Processed in {Math.round(email.metadata.processingTime)}ms
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEmails.length)} of {filteredEmails.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        currentPage === pageNum
                          ? 'bg-black text-white'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 7 && currentPage < totalPages - 3 && (
                  <>
                    <span className="px-2 text-gray-400">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

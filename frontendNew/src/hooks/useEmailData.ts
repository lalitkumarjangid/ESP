'use client';

import { useState, useEffect } from 'react';
import { generateTestEmail, getAllEmails, getEmailSummary, GenerateEmailResponse, EmailResponse, EmailSummary } from '@/lib/api';

export const useEmailData = () => {
  const [testEmail, setTestEmail] = useState<GenerateEmailResponse | null>(null);
  const [allEmails, setAllEmails] = useState<EmailResponse[]>([]);
  const [dashboard, setDashboard] = useState<EmailSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate test email
  const generateTestEmailHandler = async () => {
    try {
      setLoading(true);
      const response = await generateTestEmail();
      setTestEmail(response);
      setError(null);
    } catch (err) {
      setError('Failed to generate test email');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all emails
  const fetchAllEmails = async () => {
    try {
      setLoading(true);
      const response = await getAllEmails();
      setAllEmails(response);
      setError(null);
    } catch (err) {
      setError('Failed to fetch emails');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard data
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await getEmailSummary();
      setDashboard(response);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Process demo email for assignment demonstration
  const processDemo = async () => {
    try {
      setLoading(true);
      // For demo purposes, we'll just refresh the data
      console.log('🎯 Demo email processed');
      // Refresh data to show the new demo email
      await fetchAllEmails();
      await fetchDashboard();
      setError(null);
    } catch (err) {
      setError('Failed to process demo email');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh all data manually
  const refreshData = async () => {
    await fetchAllEmails();
    await fetchDashboard();
  };

  // Auto-refresh functionality
  const startAutoRefresh = (interval = 5000) => {
    const refreshInterval = setInterval(() => {
      fetchAllEmails();
      fetchDashboard();
    }, interval);

    return () => clearInterval(refreshInterval);
  };

  return {
    testEmail,
    allEmails,
    dashboard,
    loading,
    error,
    generateTestEmail: generateTestEmailHandler,
    processDemo,
    fetchAllEmails,
    fetchDashboard,
    refreshData,
    startAutoRefresh,
  };
};

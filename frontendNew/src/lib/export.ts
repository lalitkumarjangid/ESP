import { EmailResponse } from './api';

export const exportToCSV = (emails: EmailResponse[]) => {
  const headers = [
    'ID',
    'Subject',
    'Sender Email',
    'ESP Type',
    'Server Count',
    'Timestamp',
    'Processing Time (ms)',
    'Confidence'
  ];

  const rows = emails.map(email => [
    email.id || '',
    email.subject || '',
    email.senderEmail || '',
    email.espType || '',
    email.receivingChain.length.toString(),
    new Date(email.timestamp).toISOString(),
    email.metadata?.processingTime?.toString() || '',
    email.metadata?.confidence || ''
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `email-analysis-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (emails: EmailResponse[]) => {
  const data = {
    exportedAt: new Date().toISOString(),
    totalEmails: emails.length,
    emails: emails
  };

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `email-analysis-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

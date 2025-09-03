const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface EmailResponse {
  id: string;
  subject: string;
  receivingChain: {
    server: string;
    ip?: string;
    timestamp?: string;
    position?: number;
  }[];
  espType: string;
  timestamp: string;
  processed: boolean;
  senderEmail?: string;
  metadata?: {
    totalServers?: number;
    processingTime?: number;
    confidence?: string;
  };
}

export interface ProcessEmailRequest {
  rawEmail: string;
  subject: string;
}

export interface GenerateEmailResponse {
  email: string;
  subject: string;
}

export interface EmailSummary {
  totalEmails: number;
  totalProcessed: number;
  averageProcessingTime: number;
  espDistribution: Record<string, number>;
}

// Get all processed emails
export async function getAllEmails(): Promise<EmailResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/email/all`);
  if (!response.ok) {
    throw new Error('Failed to fetch emails');
  }
  return response.json();
}

// Process email manually
export async function processEmail(data: ProcessEmailRequest): Promise<EmailResponse> {
  const response = await fetch(`${API_BASE_URL}/api/email/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to process email');
  }
  
  return response.json();
}

// Generate test email
export async function generateTestEmail(): Promise<GenerateEmailResponse> {
  const response = await fetch(`${API_BASE_URL}/api/email/generate`);
  if (!response.ok) {
    throw new Error('Failed to generate test email');
  }
  return response.json();
}

// Get email summary statistics
export async function getEmailSummary(): Promise<EmailSummary> {
  const response = await fetch(`${API_BASE_URL}/api/email/summary`);
  if (!response.ok) {
    throw new Error('Failed to fetch email summary');
  }
  return response.json();
}
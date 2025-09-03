import { Expose } from 'class-transformer';

// Response DTO for generating test email (Assignment Requirement)
export class GenerateEmailDto {
  @Expose()
  email: string; // Email address where test emails will be sent

  @Expose()
  subject: string; // Subject line to identify the correct email
}

// Response DTO for processed email results (Assignment Requirement)
export class EmailResponseDto {
  @Expose()
  id: string;

  @Expose()
  subject: string; // Test email subject

  @Expose()
  receivingChain: {
    server: string;
    ip?: string;
    timestamp?: string;
    position?: number;
  }[]; // Sequence of servers email passed through

  @Expose()
  espType: string; // Email Service Provider type

  @Expose()
  timestamp: Date; // Processing timestamp

  @Expose()
  processed: boolean; // Processing status

  @Expose()
  senderEmail?: string; // Original sender

  @Expose()
  metadata?: {
    totalServers?: number;
    processingTime?: number;
    confidence?: string;
  }; // Additional analysis data
}

// Dashboard summary DTO for frontend
export class EmailSummaryDto {
  @Expose()
  totalEmails: number;

  @Expose()
  totalProcessed: number;

  @Expose()
  averageProcessingTime: number;

  @Expose()
  espDistribution: Record<string, number>;
}

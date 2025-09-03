import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EmailService } from '../services/email.service';
import { GenerateEmailDto, EmailResponseDto, EmailSummaryDto } from '../views/email.view';

/**
 * Email Analysis Controller for Lucid Growth Assignment
 * Handles API endpoints for email processing and analysis
 */
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Generate test email address and subject line
   * This is where users get the email address to send test emails to
   */
  @Get('generate')
  generateTestEmail(): GenerateEmailDto {
    return this.emailService.generateTestEmail();
  }

  /**
   * Get processed email results by ID
   * Returns receiving chain and ESP type for specific email
   */
  @Get('results/:id')
  async getEmailResults(@Param('id') id: string): Promise<EmailResponseDto | null> {
    return this.emailService.getEmailById(id);
  }

  /**
   * Get all processed emails
   * For dashboard display and analysis history
   */
  @Get('all')
  async getAllEmails(): Promise<EmailResponseDto[]> {
    return this.emailService.getAllEmails();
  }

  /**
   * Get dashboard summary
   * Provides analytics for the frontend dashboard
   */
  @Get('dashboard')
  async getDashboard(): Promise<EmailSummaryDto> {
    return this.emailService.getDashboardSummary();
  }

  /**
   * Demo endpoint - simulate processing a test email
   * For assignment demonstration when IMAP credentials aren't ready
   */
  @Get('demo')
  async processDemo(): Promise<EmailResponseDto> {
    return this.emailService.processDemo();
  }

  /**
   * Process a real email manually (for testing real data)
   * POST /email/process with email headers
   */
  @Post('process')
  async processRealEmail(@Body() body: { subject: string; headers: string }): Promise<EmailResponseDto> {
    return this.emailService.processEmail(body.headers, body.subject);
  }
}

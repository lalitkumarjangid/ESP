import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { simpleParser } from 'mailparser';
import { Email, EmailDocument } from '../models/email.model';
import { GenerateEmailDto, EmailResponseDto, EmailSummaryDto } from '../views/email.view';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(Email.name) private emailModel: Model<EmailDocument>,
  ) {}

  // Generate unique test email address and subject line for the assignment
  generateTestEmail(): GenerateEmailDto {
    const uuid = uuidv4().substring(0, 8); // Shorter UUID for readability
    const timestamp = Date.now();
    
    // Generate email address where test emails will be sent
    const email = `test-${uuid}@email-analysis.com`; // Professional domain name
    
    // Generate subject line to identify the correct email (as per assignment requirements)
    const subject = `EMAIL-ANALYSIS-TEST-${uuid}-${timestamp}`;
    
    console.log(`🔥 ASSIGNMENT: Generated test email details:`);
    console.log(`📧 Send your test email to: ${email}`);
    console.log(`📝 Use this exact subject: ${subject}`);
    
    return { email, subject };
  }

  // Process incoming email automatically using IMAP (assignment requirement)
  async processEmail(rawEmail: string, subject: string): Promise<EmailResponseDto> {
    console.log(`🔍 ASSIGNMENT: Processing email with subject: ${subject}`);
    
    const parsed = await simpleParser(rawEmail);
    
    // Better sender extraction - try multiple methods
    const senderEmail = parsed.from?.text || 
                       parsed.from?.value?.[0]?.address || 
                       parsed.headers.get('from') || 
                       parsed.headers.get('sender') || 
                       'unknown@unknown.com';
    
    console.log(`👤 SENDER DETECTED: ${senderEmail}`);
    
    // Extract the two key pieces of information as per assignment:
    // 1. Receiving Chain: sequence of servers the email passed through
    const receivingChain = this.extractReceivingChain(parsed.headers);
    console.log(`📍 RECEIVING CHAIN: Found ${receivingChain.length} servers in the path`);
    
    // 2. ESP Type: the provider used to send the email (sender's ESP)
    const espType = this.detectEspType(parsed.headers, senderEmail);
    console.log(`🏢 ESP DETECTED: ${espType}`);

    // Debug all headers to understand structure
    this.debugEmailHeaders(parsed.headers);

    const email = new this.emailModel({
      rawEmail,
      subject,
      receivingChain,
      espType,
      processed: true,
      senderEmail: senderEmail,
      timestamp: new Date(),
      metadata: {
        totalServers: receivingChain.length,
        processingTime: Date.now(),
        confidence: receivingChain.length > 0 ? 'High' : 'Low'
      }
    });

    const savedEmail = await email.save();
    console.log(`✅ ASSIGNMENT: Email processed and stored in MongoDB`);
    
    return {
      id: (savedEmail._id as any).toString(),
      subject: savedEmail.subject,
      receivingChain: savedEmail.receivingChain,
      espType: savedEmail.espType,
      timestamp: savedEmail.timestamp,
      processed: savedEmail.processed,
      senderEmail: savedEmail.senderEmail,
      metadata: savedEmail.metadata
    };
  }

  // Enhanced receiving chain extraction (ASSIGNMENT REQUIREMENT)
  // Extracts the path the email traveled through multiple servers
  private extractReceivingChain(headers: any): { server: string; ip?: string; timestamp?: string; position?: number }[] {
    const receivedHeaders = headers.get('received') || [];
    const chain: { server: string; ip?: string; timestamp?: string; position?: number }[] = [];
    const headersArray = Array.isArray(receivedHeaders) ? receivedHeaders : [receivedHeaders];
    
    console.log(`🔍 ASSIGNMENT: Analyzing ${headersArray.length} 'Received' headers for email path`);
    console.log(`📧 Raw headers sample:`, headersArray.slice(0, 2)); // Debug first 2 headers
    
    headersArray.forEach((header, index) => {
      if (typeof header === 'string' && header.trim()) {
        console.log(`\n🔍 Processing header ${index + 1}:`, header.substring(0, 100) + '...');
        
        // Multiple patterns to extract server name from different header formats
        const serverPatterns = [
          /by\s+([^\s;()]+)/i,                           // Standard: by server.com
          /by\s+([^;()]+?)\s+with/i,                     // by server.com with SMTP
          /by\s+([^;()]+?)\s+\(/i,                       // by server.com (details)
          /by\s+([^;()]+?)\s+via/i,                      // by server.com via
          /by\s+([^;()]+?)\s+for/i,                      // by server.com for user
          /by\s+([^;()]+?)$/i,                           // by server.com at end
          /Received:\s*from\s+[^\s]+\s+by\s+([^\s;()]+)/i, // Gmail format
          /with\s+[^\s]+\s+id\s+[^\s]+.*?by\s+([^\s;()]+)/i, // Alternative format
        ];
        
        let serverMatch: RegExpMatchArray | null = null;
        let matchedPattern = '';
        
        for (const pattern of serverPatterns) {
          serverMatch = header.match(pattern);
          if (serverMatch) {
            matchedPattern = pattern.toString();
            console.log(`✅ Server matched with pattern: ${matchedPattern.substring(0, 50)}...`);
            break;
          }
        }
        
        // Enhanced IP extraction with more patterns
        const ipPatterns = [
          /\[([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\]/,              // [192.168.1.1]
          /\(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\)/,              // (192.168.1.1)
          /from\s+[^\s]+\s+\(.*?([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/i, // from server (text 192.168.1.1)
          /\s([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\s/,              // surrounded by spaces
          /=([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,                 // =192.168.1.1
        ];
        
        let ipMatch: RegExpMatchArray | null = null;
        for (const pattern of ipPatterns) {
          ipMatch = header.match(pattern);
          if (ipMatch) break;
        }
        
        // Enhanced timestamp extraction
        const timestampPatterns = [
          /;\s*(.+?)(?:\s*\(|$)/,                        // ; timestamp (optional timezone)
          /;\s*([^()]+)/,                                // ; timestamp without parentheses
          /,\s*([0-9]{1,2}\s+[A-Za-z]{3}\s+[0-9]{4}.*?)(?:;|$)/i, // , 1 Jan 2024 format
        ];
        
        let timestampMatch: RegExpMatchArray | null = null;
        for (const pattern of timestampPatterns) {
          timestampMatch = header.match(pattern);
          if (timestampMatch) break;
        }
        
        // If we found a server, create entry
        if (serverMatch && serverMatch[1]) {
          const serverName = serverMatch[1]
            .replace(/[()]/g, '')           // Remove parentheses
            .replace(/^['"]|['"]$/g, '')    // Remove quotes
            .trim();
          
          // Skip empty or very short server names
          if (serverName.length > 2) {
            const serverEntry = {
              server: serverName,
              ip: ipMatch ? ipMatch[1] : undefined,
              timestamp: timestampMatch ? timestampMatch[1].trim() : undefined,
              position: index + 1
            };
            
            chain.push(serverEntry);
            console.log(`🔗 SERVER ${index + 1}: ${serverEntry.server} ${serverEntry.ip ? `(${serverEntry.ip})` : ''}`);
          } else {
            console.log(`⚠️ Skipped short server name: "${serverName}"`);
          }
        } else {
          console.log(`❌ No server pattern matched for header ${index + 1}`);
          // Try fallback extraction
          const fallbackMatch = header.match(/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
          if (fallbackMatch) {
            console.log(`🔄 Fallback server found: ${fallbackMatch[1]}`);
            chain.push({
              server: fallbackMatch[1],
              position: index + 1,
              timestamp: timestampMatch ? timestampMatch[1].trim() : undefined
            });
          }
        }
      }
    });
    
    // Reverse to show the actual receiving path (sender -> receiver)
    const receivingPath = chain.reverse();
    console.log(`📊 COMPLETE RECEIVING CHAIN: ${receivingPath.length} servers identified`);
    
    if (receivingPath.length === 0) {
      console.log(`⚠️ WARNING: No receiving chain extracted! This might indicate:`);
      console.log(`   - Headers are in an unexpected format`);
      console.log(`   - Email headers are missing 'Received' fields`);
      console.log(`   - Parsing patterns need adjustment for this ESP`);
    }
    
    return receivingPath;
  }

  // Debug method to understand email header structure
  private debugEmailHeaders(headers: any) {
    console.log(`\n🔍 DEBUG: Analyzing all email headers for troubleshooting:`);
    
    const allHeaderNames: string[] = [];
    if (headers && typeof headers.get === 'function') {
      // Try to get all header names if possible
      try {
        const headerMap = headers.getHeaders ? headers.getHeaders() : {};
        for (const key in headerMap) {
          allHeaderNames.push(key);
        }
      } catch (e) {
        console.log(`⚠️ Could not enumerate header names`);
      }
    }
    
    // Log specific headers that are crucial for receiving chain
    const importantHeaders = ['received', 'message-id', 'return-path', 'delivered-to', 'x-received'];
    importantHeaders.forEach(headerName => {
      const headerValue = headers.get(headerName);
      if (headerValue) {
        console.log(`📧 ${headerName.toUpperCase()}:`, 
          Array.isArray(headerValue) ? `${headerValue.length} entries` : 'single entry');
        if (headerName === 'received') {
          const receivedArray = Array.isArray(headerValue) ? headerValue : [headerValue];
          receivedArray.slice(0, 2).forEach((received, i) => {
            console.log(`   [${i}]: ${received.toString().substring(0, 150)}...`);
          });
        }
      } else {
        console.log(`❌ ${headerName.toUpperCase()}: Not found`);
      }
    });
    
    console.log(`🔍 Total header names found: ${allHeaderNames.length}`);
    if (allHeaderNames.length > 0) {
      console.log(`📝 Available headers: ${allHeaderNames.slice(0, 10).join(', ')}${allHeaderNames.length > 10 ? '...' : ''}`);
    }
  }

  // Professional ESP detection logic (ASSIGNMENT REQUIREMENT)
  // Identifies the Email Service Provider used to send the email
  private detectEspType(headers: any, from: string): string {
    console.log(`🔍 ASSIGNMENT: Detecting ESP from sender: ${from}`);
    
    // Extract sender domain for initial analysis
    const senderDomain = from.match(/@([^>\s]+)/)?.[1]?.toLowerCase() || '';
    console.log(`🌐 Sender domain: ${senderDomain}`);
    
    // Check various headers for ESP identification
    const xMailer = (headers.get('x-mailer') || '').toString().toLowerCase();
    const xOriginalSender = (headers.get('x-original-sender') || '').toString().toLowerCase();
    const messageId = (headers.get('message-id') || '').toString().toLowerCase();
    const received = (headers.get('received') || []).toString().toLowerCase();
    const xSes = headers.get('x-amz-content-sha256') || headers.get('x-ses-outgoing');
    
    // ESP Detection Logic (as per assignment requirements)
    
    // Gmail Detection
    if (senderDomain.includes('gmail.com') || 
        messageId.includes('gmail.com') ||
        received.includes('gmail.com')) {
      console.log(`✅ ESP IDENTIFIED: Gmail`);
      return 'Gmail';
    }
    
    // Microsoft Outlook/Hotmail Detection
    if (senderDomain.includes('outlook.com') || 
        senderDomain.includes('hotmail.com') || 
        senderDomain.includes('live.com') ||
        messageId.includes('outlook.com') ||
        received.includes('outlook.com')) {
      console.log(`✅ ESP IDENTIFIED: Microsoft Outlook`);
      return 'Microsoft Outlook';
    }
    
    // Yahoo Mail Detection
    if (senderDomain.includes('yahoo.com') || 
        messageId.includes('yahoo.com') ||
        received.includes('yahoo.com')) {
      console.log(`✅ ESP IDENTIFIED: Yahoo Mail`);
      return 'Yahoo Mail';
    }
    
    // iCloud Mail Detection
    if (senderDomain.includes('icloud.com') || 
        messageId.includes('icloud.com')) {
      console.log(`✅ ESP IDENTIFIED: iCloud Mail`);
      return 'iCloud Mail';
    }
    
    // Amazon SES Detection
    if (xSes || 
        xMailer.includes('ses') || 
        received.includes('amazonses.com') ||
        messageId.includes('amazonses.com')) {
      console.log(`✅ ESP IDENTIFIED: Amazon SES`);
      return 'Amazon SES';
    }
    
    // SendGrid Detection
    if (received.includes('sendgrid.net') || 
        received.includes('sendgrid.com') ||
        xMailer.includes('sendgrid')) {
      console.log(`✅ ESP IDENTIFIED: SendGrid`);
      return 'SendGrid';
    }
    
    // Mailchimp Detection
    if (received.includes('mailchimp.com') || 
        senderDomain.includes('mailchimp.com')) {
      console.log(`✅ ESP IDENTIFIED: Mailchimp`);
      return 'Mailchimp';
    }
    
    // Zoho Mail Detection
    if (senderDomain.includes('zoho.com') || 
        received.includes('zoho.com') ||
        messageId.includes('zoho.com')) {
      console.log(`✅ ESP IDENTIFIED: Zoho Mail`);
      return 'Zoho Mail';
    }
    
    // Constant Contact Detection
    if (received.includes('constantcontact.com') || 
        senderDomain.includes('constantcontact.com')) {
      console.log(`✅ ESP IDENTIFIED: Constant Contact`);
      return 'Constant Contact';
    }
    
    // Mailgun Detection
    if (received.includes('mailgun.org') || 
        received.includes('mailgun.com')) {
      console.log(`✅ ESP IDENTIFIED: Mailgun`);
      return 'Mailgun';
    }
    
    // If no specific ESP detected, return the domain or Unknown
    if (senderDomain) {
      console.log(`⚠️ ESP UNKNOWN: Using domain ${senderDomain}`);
      return `Unknown (${senderDomain})`;
    }
    
    console.log(`❌ ESP DETECTION FAILED: No identifiable ESP found`);
    return 'Unknown ESP';
  }

  // Get email by ID and map to DTO
  async getEmailById(id: string): Promise<EmailResponseDto | null> {
    const email = await this.emailModel.findById(id).exec();
    if (!email) return null;
    
    return {
      id: (email._id as any).toString(),
      subject: email.subject,
      receivingChain: email.receivingChain,
      espType: email.espType,
      timestamp: email.timestamp,
      processed: email.processed
    };
  }

  // Get all processed emails for dashboard (limit to recent 50 for performance)
  async getAllEmails(): Promise<EmailResponseDto[]> {
    const emails = await this.emailModel
      .find({ processed: true })
      .sort({ timestamp: -1 })
      .limit(50)  // Limit to 50 most recent emails
      .exec();
      
    return emails.map(email => ({
      id: (email._id as any).toString(),
      subject: email.subject,
      receivingChain: email.receivingChain,
      espType: email.espType,
      timestamp: email.timestamp,
      processed: email.processed,
      senderEmail: email.senderEmail,
      metadata: email.metadata
    }));
  }

  // Get dashboard summary (Assignment Requirement) - optimized for performance
  async getDashboardSummary(): Promise<EmailSummaryDto> {
    // Use aggregation pipeline to get ESP distribution and processing times
    const [emailStats] = await this.emailModel.aggregate([
      { $match: { processed: true } },
      {
        $group: {
          _id: null,
          totalEmails: { $sum: 1 },
          totalProcessed: { $sum: { $cond: [{ $eq: ['$processed', true] }, 1, 0] } },
          avgProcessingTime: { $avg: '$metadata.processingTime' },
          espTypes: { $push: '$espType' }
        }
      }
    ]);

    // Calculate ESP distribution
    const espDistribution: Record<string, number> = {};
    if (emailStats?.espTypes) {
      emailStats.espTypes.forEach((esp: string) => {
        espDistribution[esp] = (espDistribution[esp] || 0) + 1;
      });
    }

    const totalEmails = emailStats?.totalEmails || 0;
    const totalProcessed = emailStats?.totalProcessed || 0;
    const averageProcessingTime = emailStats?.avgProcessingTime || 0;

    return {
      totalEmails,
      totalProcessed,
      averageProcessingTime: Math.round(averageProcessingTime),
      espDistribution
    };
  }

  /**
   * Demo method - simulate processing a test email for assignment demonstration
   * This creates realistic sample data to showcase the system when IMAP isn't available
   */
  async processDemo(): Promise<EmailResponseDto> {
    const uuid = uuidv4().substring(0, 8);
    const timestamp = new Date().toISOString();
    
    // Create realistic demo receiving chain (shows email path through servers)
    const demoReceivingChain = [
      {
        server: 'smtp.gmail.com',
        ip: '74.125.200.109',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        position: 1
      },
      {
        server: 'mx.google.com',
        ip: '142.250.153.27',
        timestamp: new Date(Date.now() - 200000).toISOString(),
        position: 2
      },
      {
        server: 'email-analysis.com',
        ip: '192.168.1.100',
        timestamp: new Date(Date.now() - 100000).toISOString(),
        position: 3
      }
    ];

    // Create demo email document
    const demoEmail = new this.emailModel({
      rawEmail: 'Demo email headers (simulated for assignment)',
      subject: `EMAIL-ANALYSIS-TEST-${uuid}-${Date.now()}`,
      receivingChain: demoReceivingChain,
      espType: 'Gmail',
      timestamp,
      processed: true,
      senderEmail: 'demo.sender@gmail.com',
      metadata: {
        totalServers: demoReceivingChain.length,
        processingTime: 1250,
        confidence: 'High'
      }
    });

    // Save demo email to database
    const savedEmail = await demoEmail.save();
    
    console.log(`🎯 DEMO: Created sample email analysis for assignment demonstration`);
    console.log(`📊 ESP: Gmail | Servers: ${demoReceivingChain.length} | ID: ${savedEmail._id}`);

    return {
      id: (savedEmail._id as any).toString(),
      subject: savedEmail.subject,
      receivingChain: savedEmail.receivingChain,
      espType: savedEmail.espType,
      timestamp: savedEmail.timestamp,
      processed: savedEmail.processed,
      senderEmail: savedEmail.senderEmail,
      metadata: savedEmail.metadata
    };
  }
}

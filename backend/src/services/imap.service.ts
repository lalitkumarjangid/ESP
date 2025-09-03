import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Imap from 'imap';
import { getImapConfig } from '../config/imap.config';
import { EmailService } from './email.service';

/**
 * IMAP Service for Lucid Growth Assignment
 * Automatically detects and processes incoming test emails
 */
@Injectable()
export class ImapService implements OnModuleInit {
  private readonly logger = new Logger(ImapService.name);
  private imap: Imap;
  private imapConfig: any;

  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {
    this.imapConfig = getImapConfig(this.configService);
    this.imap = new Imap(this.imapConfig);
  }

  onModuleInit() {
    this.logger.log(
      '🚀 ASSIGNMENT: Starting IMAP service for automatic email monitoring',
    );
    this.logger.log(
      '📧 IMAP will monitor for incoming test emails and process them automatically',
    );

    // Enable IMAP monitoring
    this.startPolling();
  }

  private startPolling() {
    // Check immediately on startup
    this.logger.log('📧 ASSIGNMENT: Testing initial IMAP connection...');
    this.checkForTestEmails();

    // Then poll every 60 seconds for demo purposes (reduced frequency to prevent overload)
    setInterval(() => {
      this.logger.log('🔄 ASSIGNMENT: Checking for new emails...');
      this.checkForTestEmails();
    }, 60000); // Increased to 60 seconds

    this.logger.log(
      '📧 ASSIGNMENT: IMAP polling started - monitoring for emails every 60 seconds',
    );
  }

  private checkForTestEmails() {
    // Create a new IMAP connection for each check to avoid state issues
    const imap = new Imap(this.imapConfig);

    imap.once('ready', () => {
      this.logger.log('✅ IMAP Connected successfully');

      imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          this.logger.error(`❌ IMAP Box Error: ${err.message}`);
          imap.end();
          return;
        }

        this.logger.log(
          `📬 INBOX opened - ${box.messages.total} total messages`,
        );

        // Search for recent unread emails (limit to prevent infinite processing)
        imap.search(
          ['UNSEEN', ['SINCE', new Date(Date.now() - 24 * 60 * 60 * 1000)]],
          (err, results) => {
            if (err) {
              this.logger.error(`❌ Search Error: ${err.message}`);
              imap.end();
              return;
            }

            if (results.length > 0) {
              // Limit to max 5 emails to prevent infinite processing
              const limitedResults = results.slice(0, 5);
              this.logger.log(
                `🔍 ASSIGNMENT: Found ${results.length} new emails, processing first ${limitedResults.length}`,
              );
              this.processTestEmails(limitedResults, imap);
            } else {
              this.logger.log('📭 No new emails found in last 24 hours');
              imap.end();
            }
          },
        );
      });
    });

    imap.once('error', (err) => {
      this.logger.error(`❌ IMAP Connection Error: ${err.message}`);
      this.logger.warn(
        '💡 For assignment demo, you can test API endpoints without IMAP',
      );

      // Debug information
      this.logger.debug(
        `🔧 IMAP Config: ${this.imapConfig.user}@${this.imapConfig.host}:${this.imapConfig.port}`,
      );

      if (
        err.message.includes('Invalid credentials') ||
        err.message.includes('authentication')
      ) {
        this.logger.error('🔑 Check Gmail App Password settings');
      }
    });

    imap.once('end', () => {
      this.logger.debug('📪 IMAP connection ended cleanly');
    });

    // Set connection timeout
    const connectTimeout = setTimeout(() => {
      this.logger.warn('⏰ IMAP connection timeout');
      imap.destroy();
    }, 15000); // 15 second timeout

    try {
      imap.connect();
      // Clear timeout on successful connection
      imap.once('ready', () => clearTimeout(connectTimeout));
    } catch (error) {
      this.logger.error(`❌ Connection attempt failed: ${error.message}`);
      clearTimeout(connectTimeout);
    }
  }

  private processTestEmails(results: number[], imap: Imap) {
    // Safety check: limit processing to prevent infinite loops
    if (results.length > 5) {
      this.logger.warn(
        `⚠️ Too many emails (${results.length}), limiting to 5 for safety`,
      );
      results = results.slice(0, 5);
    }

    const fetch = imap.fetch(results, {
      bodies: '', // Get full email body
      markSeen: true, // Mark as read after processing
    });

    let processedCount = 0;

    fetch.on('message', (msg, seqno) => {
      this.logger.log(
        `📨 ASSIGNMENT: Processing email #${seqno} (${++processedCount}/${results.length})`,
      );

      msg.on('body', (stream, info) => {
        let buffer = '';

        stream.on('data', (chunk) => {
          buffer += chunk.toString('utf8');
        });

        stream.once('end', () => {
          // Extract subject from email headers more robustly
          const subjectMatch = buffer.match(/Subject:\s*(.+?)(?:\r?\n|\r)/i);
          const subject = subjectMatch
            ? subjectMatch[1].trim()
            : 'Unknown Subject';

          this.logger.log(
            `📧 ASSIGNMENT: Processing email with subject: ${subject}`,
          );

          // Process the email using EmailService
          this.emailService
            .processEmail(buffer, subject)
            .then((savedEmail) => {
              this.logger.log(
                `🎉 ASSIGNMENT: Email successfully processed and stored!`,
              );
              this.logger.log(`📊 ESP Detected: ${savedEmail.espType}`);
              this.logger.log(
                `🔗 Receiving Chain: ${savedEmail.receivingChain.length} servers`,
              );
              this.logger.log(`👤 Sender: ${savedEmail.senderEmail}`);
            })
            .catch((error) => {
              this.logger.error(`❌ Processing Error: ${error.message}`);
            });
        });
      });

      msg.once('attributes', (attrs) => {
        this.logger.log(`📧 Email attributes: ${JSON.stringify(attrs.flags)}`);
      });
    });

    fetch.once('error', (ex) => {
      this.logger.error(`❌ Fetch Error: ${ex.message}`);
    });

    fetch.once('end', () => {
      this.logger.log(
        `✅ ASSIGNMENT: Finished processing batch of ${processedCount} emails`,
      );
      imap.end();
    });
  }
}

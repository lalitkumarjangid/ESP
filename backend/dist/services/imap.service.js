"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ImapService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImapService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const imap_1 = __importDefault(require("imap"));
const imap_config_1 = require("../config/imap.config");
const email_service_1 = require("./email.service");
let ImapService = ImapService_1 = class ImapService {
    emailService;
    configService;
    logger = new common_1.Logger(ImapService_1.name);
    imap;
    imapConfig;
    constructor(emailService, configService) {
        this.emailService = emailService;
        this.configService = configService;
        this.imapConfig = (0, imap_config_1.getImapConfig)(this.configService);
        this.imap = new imap_1.default(this.imapConfig);
    }
    onModuleInit() {
        this.logger.log('🚀 ASSIGNMENT: Starting IMAP service for automatic email monitoring');
        this.logger.log('📧 IMAP will monitor for incoming test emails and process them automatically');
        this.startPolling();
    }
    startPolling() {
        this.logger.log('📧 ASSIGNMENT: Testing initial IMAP connection...');
        this.checkForTestEmails();
        setInterval(() => {
            this.logger.log('🔄 ASSIGNMENT: Checking for new emails...');
            this.checkForTestEmails();
        }, 60000);
        this.logger.log('📧 ASSIGNMENT: IMAP polling started - monitoring for emails every 60 seconds');
    }
    checkForTestEmails() {
        const imap = new imap_1.default(this.imapConfig);
        imap.once('ready', () => {
            this.logger.log('✅ IMAP Connected successfully');
            imap.openBox('INBOX', false, (err, box) => {
                if (err) {
                    this.logger.error(`❌ IMAP Box Error: ${err.message}`);
                    imap.end();
                    return;
                }
                this.logger.log(`📬 INBOX opened - ${box.messages.total} total messages`);
                imap.search(['UNSEEN', ['SINCE', new Date(Date.now() - 24 * 60 * 60 * 1000)]], (err, results) => {
                    if (err) {
                        this.logger.error(`❌ Search Error: ${err.message}`);
                        imap.end();
                        return;
                    }
                    if (results.length > 0) {
                        const limitedResults = results.slice(0, 5);
                        this.logger.log(`🔍 ASSIGNMENT: Found ${results.length} new emails, processing first ${limitedResults.length}`);
                        this.processTestEmails(limitedResults, imap);
                    }
                    else {
                        this.logger.log('📭 No new emails found in last 24 hours');
                        imap.end();
                    }
                });
            });
        });
        imap.once('error', (err) => {
            this.logger.error(`❌ IMAP Connection Error: ${err.message}`);
            this.logger.warn('💡 For assignment demo, you can test API endpoints without IMAP');
            this.logger.debug(`🔧 IMAP Config: ${this.imapConfig.user}@${this.imapConfig.host}:${this.imapConfig.port}`);
            if (err.message.includes('Invalid credentials') || err.message.includes('authentication')) {
                this.logger.error('🔑 Check Gmail App Password settings');
            }
        });
        imap.once('end', () => {
            this.logger.debug('📪 IMAP connection ended cleanly');
        });
        const connectTimeout = setTimeout(() => {
            this.logger.warn('⏰ IMAP connection timeout');
            imap.destroy();
        }, 15000);
        try {
            imap.connect();
            imap.once('ready', () => clearTimeout(connectTimeout));
        }
        catch (error) {
            this.logger.error(`❌ Connection attempt failed: ${error.message}`);
            clearTimeout(connectTimeout);
        }
    }
    processTestEmails(results, imap) {
        if (results.length > 5) {
            this.logger.warn(`⚠️ Too many emails (${results.length}), limiting to 5 for safety`);
            results = results.slice(0, 5);
        }
        const fetch = imap.fetch(results, {
            bodies: '',
            markSeen: true
        });
        let processedCount = 0;
        fetch.on('message', (msg, seqno) => {
            this.logger.log(`📨 ASSIGNMENT: Processing email #${seqno} (${++processedCount}/${results.length})`);
            msg.on('body', (stream, info) => {
                let buffer = '';
                stream.on('data', (chunk) => {
                    buffer += chunk.toString('utf8');
                });
                stream.once('end', () => {
                    const subjectMatch = buffer.match(/Subject:\s*(.+?)(?:\r?\n|\r)/i);
                    const subject = subjectMatch ? subjectMatch[1].trim() : 'Unknown Subject';
                    this.logger.log(`📧 ASSIGNMENT: Processing email with subject: ${subject}`);
                    this.emailService.processEmail(buffer, subject)
                        .then((savedEmail) => {
                        this.logger.log(`🎉 ASSIGNMENT: Email successfully processed and stored!`);
                        this.logger.log(`📊 ESP Detected: ${savedEmail.espType}`);
                        this.logger.log(`🔗 Receiving Chain: ${savedEmail.receivingChain.length} servers`);
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
            this.logger.log(`✅ ASSIGNMENT: Finished processing batch of ${processedCount} emails`);
            imap.end();
        });
    }
};
exports.ImapService = ImapService;
exports.ImapService = ImapService = ImapService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_service_1.EmailService,
        config_1.ConfigService])
], ImapService);
//# sourceMappingURL=imap.service.js.map
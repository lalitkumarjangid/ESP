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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mailparser_1 = require("mailparser");
const email_model_1 = require("../models/email.model");
const uuid_1 = require("uuid");
let EmailService = class EmailService {
    emailModel;
    constructor(emailModel) {
        this.emailModel = emailModel;
    }
    generateTestEmail() {
        const uuid = (0, uuid_1.v4)().substring(0, 8);
        const timestamp = Date.now();
        const email = `test-${uuid}@email-analysis.com`;
        const subject = `EMAIL-ANALYSIS-TEST-${uuid}-${timestamp}`;
        console.log(`🔥 ASSIGNMENT: Generated test email details:`);
        console.log(`📧 Send your test email to: ${email}`);
        console.log(`📝 Use this exact subject: ${subject}`);
        return { email, subject };
    }
    async processEmail(rawEmail, subject) {
        console.log(`🔍 ASSIGNMENT: Processing email with subject: ${subject}`);
        const parsed = await (0, mailparser_1.simpleParser)(rawEmail);
        const senderEmail = parsed.from?.text ||
            parsed.from?.value?.[0]?.address ||
            parsed.headers.get('from') ||
            parsed.headers.get('sender') ||
            'unknown@unknown.com';
        console.log(`👤 SENDER DETECTED: ${senderEmail}`);
        const receivingChain = this.extractReceivingChain(parsed.headers);
        console.log(`📍 RECEIVING CHAIN: Found ${receivingChain.length} servers in the path`);
        const espType = this.detectEspType(parsed.headers, senderEmail);
        console.log(`🏢 ESP DETECTED: ${espType}`);
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
                confidence: receivingChain.length > 0 ? 'High' : 'Low',
            },
        });
        const savedEmail = await email.save();
        console.log(`✅ ASSIGNMENT: Email processed and stored in MongoDB`);
        return {
            id: savedEmail._id.toString(),
            subject: savedEmail.subject,
            receivingChain: savedEmail.receivingChain,
            espType: savedEmail.espType,
            timestamp: savedEmail.timestamp,
            processed: savedEmail.processed,
            senderEmail: savedEmail.senderEmail,
            metadata: savedEmail.metadata,
        };
    }
    extractReceivingChain(headers) {
        const receivedHeaders = headers.get('received') || [];
        const chain = [];
        const headersArray = Array.isArray(receivedHeaders)
            ? receivedHeaders
            : [receivedHeaders];
        console.log(`🔍 ASSIGNMENT: Analyzing ${headersArray.length} 'Received' headers for email path`);
        console.log(`📧 Raw headers sample:`, headersArray.slice(0, 2));
        headersArray.forEach((header, index) => {
            if (typeof header === 'string' && header.trim()) {
                console.log(`\n🔍 Processing header ${index + 1}:`, header.substring(0, 100) + '...');
                const serverPatterns = [
                    /by\s+([^\s;()]+)/i,
                    /by\s+([^;()]+?)\s+with/i,
                    /by\s+([^;()]+?)\s+\(/i,
                    /by\s+([^;()]+?)\s+via/i,
                    /by\s+([^;()]+?)\s+for/i,
                    /by\s+([^;()]+?)$/i,
                    /Received:\s*from\s+[^\s]+\s+by\s+([^\s;()]+)/i,
                    /with\s+[^\s]+\s+id\s+[^\s]+.*?by\s+([^\s;()]+)/i,
                ];
                let serverMatch = null;
                let matchedPattern = '';
                for (const pattern of serverPatterns) {
                    serverMatch = header.match(pattern);
                    if (serverMatch) {
                        matchedPattern = pattern.toString();
                        console.log(`✅ Server matched with pattern: ${matchedPattern.substring(0, 50)}...`);
                        break;
                    }
                }
                const ipPatterns = [
                    /\[([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\]/,
                    /\(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\)/,
                    /from\s+[^\s]+\s+\(.*?([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/i,
                    /\s([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\s/,
                    /=([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
                ];
                let ipMatch = null;
                for (const pattern of ipPatterns) {
                    ipMatch = header.match(pattern);
                    if (ipMatch)
                        break;
                }
                const timestampPatterns = [
                    /;\s*(.+?)(?:\s*\(|$)/,
                    /;\s*([^()]+)/,
                    /,\s*([0-9]{1,2}\s+[A-Za-z]{3}\s+[0-9]{4}.*?)(?:;|$)/i,
                ];
                let timestampMatch = null;
                for (const pattern of timestampPatterns) {
                    timestampMatch = header.match(pattern);
                    if (timestampMatch)
                        break;
                }
                if (serverMatch && serverMatch[1]) {
                    const serverName = serverMatch[1]
                        .replace(/[()]/g, '')
                        .replace(/^['"]|['"]$/g, '')
                        .trim();
                    if (serverName.length > 2) {
                        const serverEntry = {
                            server: serverName,
                            ip: ipMatch ? ipMatch[1] : undefined,
                            timestamp: timestampMatch ? timestampMatch[1].trim() : undefined,
                            position: index + 1,
                        };
                        chain.push(serverEntry);
                        console.log(`🔗 SERVER ${index + 1}: ${serverEntry.server} ${serverEntry.ip ? `(${serverEntry.ip})` : ''}`);
                    }
                    else {
                        console.log(`⚠️ Skipped short server name: "${serverName}"`);
                    }
                }
                else {
                    console.log(`❌ No server pattern matched for header ${index + 1}`);
                    const fallbackMatch = header.match(/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
                    if (fallbackMatch) {
                        console.log(`🔄 Fallback server found: ${fallbackMatch[1]}`);
                        chain.push({
                            server: fallbackMatch[1],
                            position: index + 1,
                            timestamp: timestampMatch ? timestampMatch[1].trim() : undefined,
                        });
                    }
                }
            }
        });
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
    debugEmailHeaders(headers) {
        console.log(`\n🔍 DEBUG: Analyzing all email headers for troubleshooting:`);
        const allHeaderNames = [];
        if (headers && typeof headers.get === 'function') {
            try {
                const headerMap = headers.getHeaders ? headers.getHeaders() : {};
                for (const key in headerMap) {
                    allHeaderNames.push(key);
                }
            }
            catch (e) {
                console.log(`⚠️ Could not enumerate header names`);
            }
        }
        const importantHeaders = [
            'received',
            'message-id',
            'return-path',
            'delivered-to',
            'x-received',
        ];
        importantHeaders.forEach((headerName) => {
            const headerValue = headers.get(headerName);
            if (headerValue) {
                console.log(`📧 ${headerName.toUpperCase()}:`, Array.isArray(headerValue)
                    ? `${headerValue.length} entries`
                    : 'single entry');
                if (headerName === 'received') {
                    const receivedArray = Array.isArray(headerValue)
                        ? headerValue
                        : [headerValue];
                    receivedArray.slice(0, 2).forEach((received, i) => {
                        console.log(`   [${i}]: ${received.toString().substring(0, 150)}...`);
                    });
                }
            }
            else {
                console.log(`❌ ${headerName.toUpperCase()}: Not found`);
            }
        });
        console.log(`🔍 Total header names found: ${allHeaderNames.length}`);
        if (allHeaderNames.length > 0) {
            console.log(`📝 Available headers: ${allHeaderNames.slice(0, 10).join(', ')}${allHeaderNames.length > 10 ? '...' : ''}`);
        }
    }
    detectEspType(headers, from) {
        console.log(`🔍 ASSIGNMENT: Detecting ESP from sender: ${from}`);
        const senderDomain = from.match(/@([^>\s]+)/)?.[1]?.toLowerCase() || '';
        console.log(`🌐 Sender domain: ${senderDomain}`);
        const xMailer = (headers.get('x-mailer') || '').toString().toLowerCase();
        const xOriginalSender = (headers.get('x-original-sender') || '')
            .toString()
            .toLowerCase();
        const messageId = (headers.get('message-id') || '')
            .toString()
            .toLowerCase();
        const received = (headers.get('received') || []).toString().toLowerCase();
        const xSes = headers.get('x-amz-content-sha256') || headers.get('x-ses-outgoing');
        if (senderDomain.includes('gmail.com') ||
            messageId.includes('gmail.com') ||
            received.includes('gmail.com')) {
            console.log(`✅ ESP IDENTIFIED: Gmail`);
            return 'Gmail';
        }
        if (senderDomain.includes('outlook.com') ||
            senderDomain.includes('hotmail.com') ||
            senderDomain.includes('live.com') ||
            messageId.includes('outlook.com') ||
            received.includes('outlook.com')) {
            console.log(`✅ ESP IDENTIFIED: Microsoft Outlook`);
            return 'Microsoft Outlook';
        }
        if (senderDomain.includes('yahoo.com') ||
            messageId.includes('yahoo.com') ||
            received.includes('yahoo.com')) {
            console.log(`✅ ESP IDENTIFIED: Yahoo Mail`);
            return 'Yahoo Mail';
        }
        if (senderDomain.includes('icloud.com') ||
            messageId.includes('icloud.com')) {
            console.log(`✅ ESP IDENTIFIED: iCloud Mail`);
            return 'iCloud Mail';
        }
        if (xSes ||
            xMailer.includes('ses') ||
            received.includes('amazonses.com') ||
            messageId.includes('amazonses.com')) {
            console.log(`✅ ESP IDENTIFIED: Amazon SES`);
            return 'Amazon SES';
        }
        if (received.includes('sendgrid.net') ||
            received.includes('sendgrid.com') ||
            xMailer.includes('sendgrid')) {
            console.log(`✅ ESP IDENTIFIED: SendGrid`);
            return 'SendGrid';
        }
        if (received.includes('mailchimp.com') ||
            senderDomain.includes('mailchimp.com')) {
            console.log(`✅ ESP IDENTIFIED: Mailchimp`);
            return 'Mailchimp';
        }
        if (senderDomain.includes('zoho.com') ||
            received.includes('zoho.com') ||
            messageId.includes('zoho.com')) {
            console.log(`✅ ESP IDENTIFIED: Zoho Mail`);
            return 'Zoho Mail';
        }
        if (received.includes('constantcontact.com') ||
            senderDomain.includes('constantcontact.com')) {
            console.log(`✅ ESP IDENTIFIED: Constant Contact`);
            return 'Constant Contact';
        }
        if (received.includes('mailgun.org') || received.includes('mailgun.com')) {
            console.log(`✅ ESP IDENTIFIED: Mailgun`);
            return 'Mailgun';
        }
        if (senderDomain) {
            console.log(`⚠️ ESP UNKNOWN: Using domain ${senderDomain}`);
            return `Unknown (${senderDomain})`;
        }
        console.log(`❌ ESP DETECTION FAILED: No identifiable ESP found`);
        return 'Unknown ESP';
    }
    async getEmailById(id) {
        const email = await this.emailModel.findById(id).exec();
        if (!email)
            return null;
        return {
            id: email._id.toString(),
            subject: email.subject,
            receivingChain: email.receivingChain,
            espType: email.espType,
            timestamp: email.timestamp,
            processed: email.processed,
        };
    }
    async getAllEmails() {
        const emails = await this.emailModel
            .find({ processed: true })
            .sort({ timestamp: -1 })
            .limit(50)
            .exec();
        return emails.map((email) => ({
            id: email._id.toString(),
            subject: email.subject,
            receivingChain: email.receivingChain,
            espType: email.espType,
            timestamp: email.timestamp,
            processed: email.processed,
            senderEmail: email.senderEmail,
            metadata: email.metadata,
        }));
    }
    async getDashboardSummary() {
        const [emailStats] = await this.emailModel.aggregate([
            { $match: { processed: true } },
            {
                $group: {
                    _id: null,
                    totalEmails: { $sum: 1 },
                    totalProcessed: {
                        $sum: { $cond: [{ $eq: ['$processed', true] }, 1, 0] },
                    },
                    avgProcessingTime: { $avg: '$metadata.processingTime' },
                    espTypes: { $push: '$espType' },
                },
            },
        ]);
        const espDistribution = {};
        if (emailStats?.espTypes) {
            emailStats.espTypes.forEach((esp) => {
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
            espDistribution,
        };
    }
    async processDemo() {
        const uuid = (0, uuid_1.v4)().substring(0, 8);
        const timestamp = new Date().toISOString();
        const demoReceivingChain = [
            {
                server: 'smtp.gmail.com',
                ip: '74.125.200.109',
                timestamp: new Date(Date.now() - 300000).toISOString(),
                position: 1,
            },
            {
                server: 'mx.google.com',
                ip: '142.250.153.27',
                timestamp: new Date(Date.now() - 200000).toISOString(),
                position: 2,
            },
            {
                server: 'email-analysis.com',
                ip: '192.168.1.100',
                timestamp: new Date(Date.now() - 100000).toISOString(),
                position: 3,
            },
        ];
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
                confidence: 'High',
            },
        });
        const savedEmail = await demoEmail.save();
        console.log(`🎯 DEMO: Created sample email analysis for assignment demonstration`);
        console.log(`📊 ESP: Gmail | Servers: ${demoReceivingChain.length} | ID: ${savedEmail._id}`);
        return {
            id: savedEmail._id.toString(),
            subject: savedEmail.subject,
            receivingChain: savedEmail.receivingChain,
            espType: savedEmail.espType,
            timestamp: savedEmail.timestamp,
            processed: savedEmail.processed,
            senderEmail: savedEmail.senderEmail,
            metadata: savedEmail.metadata,
        };
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(email_model_1.Email.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], EmailService);
//# sourceMappingURL=email.service.js.map
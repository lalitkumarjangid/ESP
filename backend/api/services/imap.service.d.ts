import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
export declare class ImapService implements OnModuleInit {
    private readonly emailService;
    private readonly configService;
    private readonly logger;
    private imap;
    private imapConfig;
    constructor(emailService: EmailService, configService: ConfigService);
    onModuleInit(): void;
    private startPolling;
    private checkForTestEmails;
    private processTestEmails;
}

import { EmailService } from '../services/email.service';
import { GenerateEmailDto, EmailResponseDto, EmailSummaryDto } from '../views/email.view';
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    generateTestEmail(): GenerateEmailDto;
    getEmailResults(id: string): Promise<EmailResponseDto | null>;
    getAllEmails(): Promise<EmailResponseDto[]>;
    getSummary(): Promise<EmailSummaryDto>;
    getDashboard(): Promise<EmailSummaryDto>;
    processDemo(): Promise<EmailResponseDto>;
    processRealEmail(body: {
        subject: string;
        rawEmail: string;
    }): Promise<EmailResponseDto>;
}

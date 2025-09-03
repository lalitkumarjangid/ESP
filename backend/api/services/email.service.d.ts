import { Model } from 'mongoose';
import { EmailDocument } from '../models/email.model';
import { GenerateEmailDto, EmailResponseDto, EmailSummaryDto } from '../views/email.view';
export declare class EmailService {
    private emailModel;
    constructor(emailModel: Model<EmailDocument>);
    generateTestEmail(): GenerateEmailDto;
    processEmail(rawEmail: string, subject: string): Promise<EmailResponseDto>;
    private extractReceivingChain;
    private debugEmailHeaders;
    private detectEspType;
    getEmailById(id: string): Promise<EmailResponseDto | null>;
    getAllEmails(): Promise<EmailResponseDto[]>;
    getDashboardSummary(): Promise<EmailSummaryDto>;
    processDemo(): Promise<EmailResponseDto>;
}

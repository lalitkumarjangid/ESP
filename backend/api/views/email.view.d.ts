export declare class GenerateEmailDto {
    email: string;
    subject: string;
}
export declare class EmailResponseDto {
    id: string;
    subject: string;
    receivingChain: {
        server: string;
        ip?: string;
        timestamp?: string;
        position?: number;
    }[];
    espType: string;
    timestamp: Date;
    processed: boolean;
    senderEmail?: string;
    metadata?: {
        totalServers?: number;
        processingTime?: number;
        confidence?: string;
    };
}
export declare class EmailSummaryDto {
    totalEmails: number;
    totalProcessed: number;
    averageProcessingTime: number;
    espDistribution: Record<string, number>;
}

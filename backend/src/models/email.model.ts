import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmailDocument = Email & Document;

// Email Analysis Schema for Lucid Growth Assignment
@Schema()
export class Email {
  @Prop({ required: true })
  rawEmail: string; // Store complete email for analysis

  @Prop({ required: true })
  subject: string; // Subject line used to identify test email

  @Prop({ type: [Object] }) // Receiving chain data structure
  receivingChain: {
    server: string;
    ip?: string;
    timestamp?: string;
    position?: number;
  }[];

  @Prop({ required: true })
  espType: string; // Email Service Provider type

  @Prop({ default: Date.now })
  timestamp: Date; // When email was processed

  @Prop({ default: false })
  processed: boolean; // Processing status

  @Prop() // Store sender information
  senderEmail?: string;

  @Prop({ type: Object }) // Store additional metadata
  metadata?: {
    totalServers?: number;
    processingTime?: number;
    confidence?: string;
  };
}

export const EmailSchema = SchemaFactory.createForClass(Email);

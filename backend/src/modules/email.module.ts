import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailController } from '../controllers/email.controller';
import { EmailService } from '../services/email.service';
import { Email, EmailSchema } from '../models/email.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }])],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}

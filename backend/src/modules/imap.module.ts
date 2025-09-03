import { Module } from '@nestjs/common';
import { ImapService } from '../services/imap.service';
import { EmailModule } from './email.module';

@Module({
  imports: [EmailModule],
  providers: [ImapService],
})
export class ImapModule {}

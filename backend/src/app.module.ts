import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './modules/email.module';
import { ImapModule } from './modules/imap.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    databaseConfig,
    EmailModule,
    ImapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

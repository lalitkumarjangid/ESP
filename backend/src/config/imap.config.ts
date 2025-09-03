import { ConfigService } from '@nestjs/config';

// Create a function that returns the config using ConfigService
export const getImapConfig = (configService?: ConfigService) => {
  // Fallback to process.env if ConfigService is not available
  const user = configService ? configService.get('IMAP_USER') : process.env.IMAP_USER;
  const password = configService ? configService.get('IMAP_PASSWORD') : process.env.IMAP_PASSWORD;
  const host = configService ? configService.get('IMAP_HOST') : process.env.IMAP_HOST;
  const port = configService ? 
    parseInt(configService.get('IMAP_PORT') || '993') : 
    parseInt(process.env.IMAP_PORT || '993');

  return {
    user,
    password,
    host,
    port,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  };
};

// Export the static config for backward compatibility
export const imapConfig = getImapConfig();

import { ConfigService } from '@nestjs/config';
export declare const getImapConfig: (configService?: ConfigService) => {
    user: any;
    password: any;
    host: any;
    port: number;
    tls: boolean;
    tlsOptions: {
        rejectUnauthorized: boolean;
    };
};
export declare const imapConfig: {
    user: any;
    password: any;
    host: any;
    port: number;
    tls: boolean;
    tlsOptions: {
        rejectUnauthorized: boolean;
    };
};

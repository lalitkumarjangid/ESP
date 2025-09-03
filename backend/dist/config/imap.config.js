"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imapConfig = exports.getImapConfig = void 0;
const getImapConfig = (configService) => {
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
exports.getImapConfig = getImapConfig;
exports.imapConfig = (0, exports.getImapConfig)();
//# sourceMappingURL=imap.config.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentWorkflow = exports.RouteDescriptions = exports.EmailRoutes = void 0;
exports.EmailRoutes = {
    GENERATE: '/email/generate',
    RESULTS: '/email/results/:id',
    ALL_EMAILS: '/email/all',
    DASHBOARD: '/email/dashboard',
    BASE_PATH: '/email',
};
exports.RouteDescriptions = {
    [exports.EmailRoutes.GENERATE]: 'Generate unique test email address and subject line for sending test emails',
    [exports.EmailRoutes.RESULTS]: 'Get processed email data including receiving chain and ESP type by email ID',
    [exports.EmailRoutes.ALL_EMAILS]: 'Get all processed emails for dashboard display',
    [exports.EmailRoutes.DASHBOARD]: 'Get dashboard summary with analytics and recent emails',
};
exports.AssignmentWorkflow = {
    step1: 'Call GET /email/generate to get test email address and subject',
    step2: 'Send email to the provided address with the exact subject line',
    step3: 'IMAP service automatically detects and processes the email',
    step4: 'Use GET /email/all or GET /email/dashboard to see results',
    step5: 'Frontend displays receiving chain and ESP type visually',
};
//# sourceMappingURL=email.routes.js.map
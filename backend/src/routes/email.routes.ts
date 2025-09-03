/**
 * Email Analysis API Routes - Lucid Growth Assignment
 * Professional email analysis system routes and documentation
 */

export const EmailRoutes = {
  // ASSIGNMENT REQUIREMENT: Generate test email endpoint
  GENERATE: '/email/generate',
  
  // ASSIGNMENT REQUIREMENT: Get email results endpoint  
  RESULTS: '/email/results/:id',
  
  // Dashboard and analytics endpoints
  ALL_EMAILS: '/email/all',
  DASHBOARD: '/email/dashboard',
  
  // Base path
  BASE_PATH: '/email'
};

// Route descriptions for API documentation
export const RouteDescriptions = {
  [EmailRoutes.GENERATE]: 'Generate unique test email address and subject line for sending test emails',
  [EmailRoutes.RESULTS]: 'Get processed email data including receiving chain and ESP type by email ID',
  [EmailRoutes.ALL_EMAILS]: 'Get all processed emails for dashboard display',
  [EmailRoutes.DASHBOARD]: 'Get dashboard summary with analytics and recent emails'
};

// Assignment workflow documentation
export const AssignmentWorkflow = {
  step1: 'Call GET /email/generate to get test email address and subject',
  step2: 'Send email to the provided address with the exact subject line',
  step3: 'IMAP service automatically detects and processes the email',
  step4: 'Use GET /email/all or GET /email/dashboard to see results',
  step5: 'Frontend displays receiving chain and ESP type visually'
};

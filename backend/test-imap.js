/**
 * Gmail IMAP Test Script - Lucid Growth Assignment
 * Use this to test your Gmail credentials before running the main app
 */

const Imap = require('imap');
require('dotenv').config();

const testImap = new Imap({
  user: process.env.IMAP_USER,
  password: process.env.IMAP_PASSWORD,
  host: process.env.IMAP_HOST,
  port: parseInt(process.env.IMAP_PORT),
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
  // Removed debug mode
});

console.log('🧪 Testing Gmail IMAP Connection...');
console.log(`📧 Email: ${process.env.IMAP_USER}`);
console.log(`🔑 Password: ${process.env.IMAP_PASSWORD ? '***hidden***' : 'NOT SET'}`);
console.log(`🏠 Host: ${process.env.IMAP_HOST}:${process.env.IMAP_PORT}`);

testImap.once('ready', () => {
  console.log('✅ SUCCESS: IMAP connection established!');
  console.log('🎉 Gmail credentials are working correctly');
  testImap.end();
});

testImap.once('error', (err) => {
  console.log('❌ FAILED: IMAP connection error');
  console.log('Error:', err.message);
  
  if (err.message.includes('Invalid credentials')) {
    console.log('\n🔧 TROUBLESHOOTING STEPS:');
    console.log('1. Go to https://myaccount.google.com/security');
    console.log('2. Enable 2-Step Verification if not enabled');
    console.log('3. Go to App passwords → Generate new password');
    console.log('4. Select "Mail" and "Other (Custom name)"');
    console.log('5. Copy the 16-character password (remove spaces)');
    console.log('6. Update your .env file with the new password');
  }
});

testImap.once('end', () => {
  console.log('📪 Connection ended');
  process.exit(0);
});

// Connect with timeout
setTimeout(() => {
  console.log('⏰ Connection timeout - check your settings');
  process.exit(1);
}, 15000);

testImap.connect();

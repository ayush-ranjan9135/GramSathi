import 'dotenv/config';
import { sendEmailOTP } from './services/emailService.js';

console.log('\n🧪 BREVO EMAIL SERVICE TEST\n');
console.log('═'.repeat(60));

// Check environment variables
console.log('\n📋 Environment Configuration:');
console.log('─'.repeat(60));
console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? '✅ Set (' + process.env.BREVO_API_KEY.substring(0, 10) + '...)' : '❌ NOT SET');
console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ NOT SET');
console.log('─'.repeat(60));

if (!process.env.BREVO_API_KEY) {
  console.log('\n❌ ERROR: BREVO_API_KEY is not set in .env file\n');
  console.log('📝 TO FIX:');
  console.log('1. Go to: https://app.brevo.com/settings/keys/api');
  console.log('2. Create a new API key');
  console.log('3. Copy the API key');
  console.log('4. Add to .env file: BREVO_API_KEY=your_api_key_here');
  console.log('5. Add verified sender: EMAIL_USER=your_verified_email@example.com\n');
  process.exit(1);
}

if (!process.env.EMAIL_USER) {
  console.log('\n⚠️  WARNING: EMAIL_USER is not set in .env file');
  console.log('Using default: no-reply@gramsathi.in\n');
}

async function testBrevoEmail() {
  try {
    // Get test email from command line or use EMAIL_USER
    const testEmail = process.argv[2] || process.env.EMAIL_USER;
    
    if (!testEmail) {
      console.log('\n❌ ERROR: No email address provided\n');
      console.log('Usage: node testBrevoEmail.js your_email@example.com');
      console.log('   OR: Set EMAIL_USER in .env file\n');
      process.exit(1);
    }

    console.log('\n🚀 Testing Brevo Email Service...\n');
    console.log('📧 Sending test OTP to:', testEmail);
    console.log('⏳ Please wait...\n');

    const testOTP = '123456';
    const startTime = Date.now();
    
    const result = await sendEmailOTP(testEmail, testOTP);
    
    const duration = Date.now() - startTime;

    console.log('─'.repeat(60));
    
    if (result.success) {
      console.log('\n✅ SUCCESS! Email sent via Brevo\n');
      console.log('📊 Details:');
      console.log('   • Recipient:', testEmail);
      console.log('   • OTP:', testOTP);
      console.log('   • Message ID:', result.messageId || 'N/A');
      console.log('   • Duration:', duration + 'ms');
      console.log('\n📬 Check your inbox:', testEmail);
      console.log('📁 Also check spam/junk folder if not in inbox\n');
      console.log('✅ Brevo email service is working perfectly!\n');
    } else {
      console.log('\n❌ FAILED! Email could not be sent\n');
      console.log('📊 Error Details:');
      console.log('   • Error:', result.error);
      console.log('   • Duration:', duration + 'ms');
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Verify BREVO_API_KEY is correct');
      console.log('2. Check if sender email is verified in Brevo');
      console.log('3. Verify you have email credits in Brevo');
      console.log('4. Check Brevo dashboard: https://app.brevo.com/');
      console.log('5. Review API logs in Brevo\n');
    }
    
    console.log('═'.repeat(60));
    
  } catch (error) {
    console.log('\n❌ UNEXPECTED ERROR:\n');
    console.error(error);
    console.log('\n🔧 Common Issues:');
    console.log('1. Invalid API key format');
    console.log('2. Network connectivity issues');
    console.log('3. Brevo service temporarily unavailable');
    console.log('4. Invalid sender email address\n');
  }
}

// Run the test
testBrevoEmail();

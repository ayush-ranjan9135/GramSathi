import 'dotenv/config';
import nodemailer from 'nodemailer';

console.log('\n🔍 EMAIL CONFIGURATION DEBUG\n');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ NOT SET');

if (!process.env.EMAIL_PASS) {
  console.log('\n❌ EMAIL_PASS is empty! This is why emails are failing.\n');
  console.log('📝 TO FIX:');
  console.log('1. Go to: https://myaccount.google.com/apppasswords');
  console.log('2. Sign in with:', process.env.EMAIL_USER);
  console.log('3. Create app password for "Mail"');
  console.log('4. Copy 16-character password');
  console.log('5. Update .env: EMAIL_PASS=your_password_here\n');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function testEmail() {
  try {
    console.log('\n📧 Testing email connection...\n');
    
    await transporter.verify();
    console.log('✅ Email server connection successful!\n');
    
    const testOTP = '123456';
    const info = await transporter.sendMail({
      from: `"GramSathi Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'GramSathi Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">✅ Email Service Working!</h2>
          <p>Your test OTP is:</p>
          <h1 style="color: #059669; font-size: 32px; letter-spacing: 5px;">${testOTP}</h1>
          <p>Email configuration is correct.</p>
        </div>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('📧 Check your inbox:', process.env.EMAIL_USER);
    console.log('\n✅ Email service is working correctly!\n');
    
  } catch (error) {
    console.error('\n❌ Email test failed:', error.message);
    console.log('\n🔧 Common fixes:');
    console.log('1. Enable 2-factor authentication on Gmail');
    console.log('2. Generate App Password (not regular password)');
    console.log('3. Check EMAIL_PASS in .env file');
    console.log('4. Make sure no spaces in password\n');
  }
}

testEmail();

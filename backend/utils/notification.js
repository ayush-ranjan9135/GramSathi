import { BrevoClient } from '@getbrevo/brevo';
import twilio from 'twilio';

let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && 
    process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendEmailOTP = async (email, otp) => {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    
    if (!apiKey || apiKey.trim() === '') {
      console.log('⚠️  BREVO_API_KEY not configured');
      return { success: false, error: 'Brevo API key not configured' };
    }

    const client = new BrevoClient({ apiKey });
    const senderEmail = process.env.EMAIL_USER || process.env.BREVO_SENDER_EMAIL || 'no-reply@gramsathi.in';

    const emailData = {
      sender: { name: 'GramSathi', email: senderEmail },
      to: [{ email }],
      subject: 'GramSathi - OTP Verification',
      htmlContent: `<p>Your OTP is: <strong>${otp}</strong></p><p>Valid for 10 minutes.</p>`
    };

    await client.transactionalEmails.sendTransacEmail(emailData);
    return { success: true };
  } catch (error) {
    console.error('❌ Brevo Email error:', error.message || error);
    return { success: false, error: error.message || 'API Error' };
  }
};

export const sendSMSOTP = async (phone, otp) => {
  if (!twilioClient) {
    console.log(`SMS OTP (${otp}) would be sent to ${phone} - Twilio not configured`);
    return;
  }
  await twilioClient.messages.create({
    body: `Your GramSathi OTP is: ${otp}. Valid for 10 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });
};

export const sendEmail = async (to, subject, html) => {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    
    if (!apiKey || apiKey.trim() === '') {
      console.log('⚠️  BREVO_API_KEY not configured');
      return { success: false, error: 'Brevo API key not configured' };
    }

    const client = new BrevoClient({ apiKey });
    const senderEmail = process.env.EMAIL_USER || process.env.BREVO_SENDER_EMAIL || 'no-reply@gramsathi.in';

    const emailData = {
      sender: { name: 'GramSathi', email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html
    };

    await client.transactionalEmails.sendTransacEmail(emailData);
    return { success: true };
  } catch (error) {
    console.error('❌ Brevo Email error:', error.message || error);
    return { success: false, error: error.message || 'API Error' };
  }
};

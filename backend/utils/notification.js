const nodemailer = require('nodemailer');

let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && 
    process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  const twilio = require('twilio');
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendEmailOTP = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'GramSathi - OTP Verification',
    html: `<p>Your OTP is: <strong>${otp}</strong></p><p>Valid for 10 minutes.</p>`
  });
};

exports.sendSMSOTP = async (phone, otp) => {
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

exports.sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  });
};

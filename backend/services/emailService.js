const nodemailer = require('nodemailer');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmailOTP = async (email, otp) => {
  try {
    // Check if email is configured
    if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS.trim() === '') {
      console.log('⚠️  EMAIL_PASS not configured');
      return { success: false, error: 'Email not configured' };
    }

    const port = parseInt(process.env.EMAIL_PORT) || 587;
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: port,
      secure: port === 465, // true for port 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Email server connected');

    const mailOptions = {
      from: `"GramSathi" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Your GramSathi Verification Code',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>GramSathi OTP</title>
</head>
<body style="margin:0;padding:0;background-color:#f0fdf4;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(16,185,129,0.12);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#059669 0%,#10b981 60%,#34d399 100%);padding:36px 40px;text-align:center;">
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <!-- Logo Icon -->
                    <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:50%;width:60px;height:60px;line-height:60px;font-size:28px;margin-bottom:12px;">🌿</div>
                    <br/>
                    <span style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:1px;">GramSathi</span>
                    <br/>
                    <span style="font-size:13px;color:rgba(255,255,255,0.85);letter-spacing:2px;text-transform:uppercase;margin-top:4px;display:block;">Your Rural Companion</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px 32px;">

              <h2 style="margin:0 0 8px;font-size:22px;color:#111827;font-weight:700;">Verify Your Identity</h2>
              <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;">
                We received a request to sign in to your GramSathi account. Use the one-time password (OTP) below to complete your verification.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 28px;">
                    <div style="display:inline-block;background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:2px solid #6ee7b7;border-radius:14px;padding:24px 48px;text-align:center;">
                      <p style="margin:0 0 6px;font-size:12px;color:#059669;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Your OTP Code</p>
                      <p style="margin:0;font-size:42px;font-weight:800;color:#065f46;letter-spacing:10px;font-family:'Courier New',monospace;">${otp}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Timer notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#fefce8;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:12px 16px;">
                    <p style="margin:0;font-size:13px;color:#92400e;">
                      ⏱ This code will expire in <strong>5 minutes</strong>. Please do not share it with anyone.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Security note -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f9fafb;border-radius:10px;padding:16px 20px;">
                    <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.7;">
                      🔒 <strong style="color:#374151;">Didn't request this?</strong> If you did not initiate this request, you can safely ignore this email. Your account remains secure.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 48px;">
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px 36px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} GramSathi. All rights reserved.</p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">Empowering rural communities across India 🇮🇳</p>
            </td>
          </tr>

        </table>
        <!-- End Card -->

      </td>
    </tr>
  </table>

</body>
</html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { generateOTP, sendEmailOTP };

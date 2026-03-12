# Email OTP Setup Guide

## Gmail Configuration for Nodemailer

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security**
3. Enable **2-Step Verification**

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter "GramSathi" as the name
5. Click **Generate**
6. Copy the 16-character password (remove spaces)

### Step 3: Update .env File
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password
```

### Step 4: Test Email Service
Run the backend server and test registration:
```bash
cd backend
npm run dev
```

## Alternative Email Providers

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_password
```

### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your_email@yahoo.com
EMAIL_PASS=your_app_password
```

## Troubleshooting

### Error: "Invalid login"
- Ensure 2FA is enabled
- Use App Password, not regular password
- Check EMAIL_USER matches the Gmail account

### Error: "Connection timeout"
- Check firewall settings
- Verify EMAIL_PORT is 587
- Try EMAIL_PORT=465 with secure: true

### Error: "Self-signed certificate"
- Add to transporter config:
```javascript
tls: { rejectUnauthorized: false }
```

## Testing OTP Flow

1. **Register**: POST `/api/auth/register`
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "1234567890",
  "password": "password123",
  "role": "villager",
  "village": "Test Village"
}
```

2. **Check Email**: Look for OTP in inbox
3. **Verify OTP**: POST `/api/auth/verify-otp`
```json
{
  "userId": "user_id_from_register",
  "otp": "123456"
}
```

## Security Best Practices

- Never commit .env file to Git
- Use App Passwords, not account passwords
- Rotate passwords regularly
- Monitor email sending limits (Gmail: 500/day)
- Implement rate limiting (already done)

## Email Sending Limits

- **Gmail**: 500 emails/day
- **Outlook**: 300 emails/day
- **Yahoo**: 500 emails/day

For production, consider:
- SendGrid (100 emails/day free)
- AWS SES (62,000 emails/month free)
- Mailgun (5,000 emails/month free)

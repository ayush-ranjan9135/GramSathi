# WhatsApp Cloud API Setup Guide

## 1. Create Meta Developer Account
1. Go to https://developers.facebook.com/
2. Create a developer account
3. Create a new app → Business → WhatsApp

## 2. Get WhatsApp API Credentials
1. In your app dashboard, go to WhatsApp → API Setup
2. Copy the following:
   - **Phone Number ID** (from "From" phone number)
   - **WhatsApp Business Account ID**
   - **Access Token** (temporary, generate permanent one)

## 3. Generate Permanent Access Token
1. Go to WhatsApp → Configuration
2. Generate a permanent access token
3. Add required permissions: `whatsapp_business_messaging`

## 4. Update Environment Variables
Add to your `.env` file:
```env
WHATSAPP_TOKEN=your_permanent_access_token
PHONE_NUMBER_ID=your_phone_number_id
VERIFY_TOKEN=your_custom_verify_token_123
```

## 5. Test Phone Numbers (Development)
1. Go to WhatsApp → API Setup
2. Add test recipient phone numbers
3. Send test message to verify setup

## 6. Webhook Configuration (Optional)
1. Webhook URL: `https://yourdomain.com/api/auth/webhook`
2. Verify Token: Use the same as `VERIFY_TOKEN` in .env
3. Subscribe to: `messages`

## 7. Production Setup
1. Add your business phone number
2. Complete business verification
3. Submit app for review

## API Request Example
```javascript
// WhatsApp API Call
POST https://graph.facebook.com/v18.0/{phone-number-id}/messages
Headers:
  Authorization: Bearer {access-token}
  Content-Type: application/json

Body:
{
  "messaging_product": "whatsapp",
  "to": "919999999999",
  "type": "text",
  "text": {
    "body": "Your GramSathi verification OTP is: 123456. This OTP is valid for 5 minutes."
  }
}
```

## Testing
1. Start your server: `npm run dev`
2. Register a new user with your WhatsApp number
3. Check WhatsApp for OTP message
4. If WhatsApp fails, OTP will be logged to console as fallback
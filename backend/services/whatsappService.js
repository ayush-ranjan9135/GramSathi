const axios = require('axios');

class WhatsAppService {
  constructor() {
    this.token = process.env.WHATSAPP_TOKEN;
    this.phoneNumberId = process.env.PHONE_NUMBER_ID;
    this.baseURL = `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`;
  }

  // Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send WhatsApp OTP message
  async sendWhatsAppOTP(phone, otp) {
    try {
      // Format phone number (remove + if present, ensure country code)
      const formattedPhone = phone.startsWith('+') ? phone.substring(1) : phone;
      const finalPhone = formattedPhone.startsWith('91') ? formattedPhone : `91${formattedPhone}`;

      const message = `Your GramSathi verification OTP is: ${otp}. This OTP is valid for 5 minutes.`;

      const payload = {
        messaging_product: "whatsapp",
        to: finalPhone,
        type: "text",
        text: {
          body: message
        }
      };

      const response = await axios.post(this.baseURL, payload, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('WhatsApp OTP sent successfully:', response.data);
      return { success: true, messageId: response.data.messages[0].id };
    } catch (error) {
      console.error('WhatsApp OTP sending failed:', error.response?.data || error.message);
      
      // Fallback: Log OTP to console if WhatsApp fails
      console.log(`FALLBACK - OTP for ${phone}: ${otp}`);
      
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message,
        fallback: true 
      };
    }
  }

  // Verify webhook (for WhatsApp webhook setup)
  verifyWebhook(mode, token, challenge) {
    const verifyToken = process.env.VERIFY_TOKEN;
    
    if (mode === "subscribe" && token === verifyToken) {
      return challenge;
    }
    return null;
  }
}

module.exports = new WhatsAppService();
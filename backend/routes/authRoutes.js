const express = require('express');
const router = express.Router();
const { register, verifyOTP, login, forgotPassword, resetPassword, getProfile, updateProfile } = require('../controllers/authController');
const whatsappService = require('../services/whatsappService');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// WhatsApp webhook routes
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  const result = whatsappService.verifyWebhook(mode, token, challenge);
  if (result) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

router.post('/webhook', (req, res) => {
  console.log('WhatsApp webhook received:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

module.exports = router;

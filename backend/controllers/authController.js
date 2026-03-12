const jwt = require('jsonwebtoken');
const User = require('../models/User');
const emailService = require('../services/emailService');
const cacheService = require('../services/cacheService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role, village, address } = req.body;
    
    // Rate limiting
    const canProceed = await cacheService.checkRateLimit(`register:${email}`, 10, 300);
    if (!canProceed) {
      return res.status(429).json({ message: 'Too many attempts. Try again later.' });
    }
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = emailService.generateOTP();

    // Store user data temporarily in Redis (don't create user yet)
    await cacheService.set(`temp_user:${email}`, {
      name, email, phone, password, role, village, address
    }, 300);

    // Store OTP in Redis
    await cacheService.setOTP(email, otp, 300);

    // Send OTP via Email
    const emailResult = await emailService.sendEmailOTP(email, otp);
    
    if (emailResult.success) {
      console.log(`✅ OTP sent successfully to ${email}`);
      res.status(200).json({ 
        message: 'OTP sent to your email. Please verify.'
      });
    } else {
      // For development: Log OTP to console if email fails
      console.log('\n🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴');
      console.log('⚠️  EMAIL SERVICE NOT CONFIGURED');
      console.log('📧 Email:', email);
      console.log('🔑 OTP:', otp);
      console.log('⏰ Valid for: 5 minutes');
      console.log('🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴\n');
      
      res.status(200).json({ 
        message: 'OTP generated. Check console for OTP.', 
        devMode: true,
        otp: otp // Only for development
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    console.log('\n📥 Verify OTP Request Body:', JSON.stringify(req.body, null, 2));
    
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      console.log('❌ Missing email or OTP');
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    console.log(`🔍 Checking OTP for email: ${email}`);
    
    // Get OTP from Redis
    const cachedOTP = await cacheService.getOTP(email);
    console.log('📦 Cached OTP:', cachedOTP);
    
    if (!cachedOTP || cachedOTP.otp !== otp) {
      console.log('❌ Invalid or expired OTP');
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Get temporary user data from Redis
    const tempUserData = await cacheService.get(`temp_user:${email}`);
    console.log('📦 Temp user data exists:', !!tempUserData);
    
    if (!tempUserData) {
      console.log('❌ Registration session expired');
      return res.status(400).json({ message: 'Registration session expired. Please register again.' });
    }

    // Check if data is already parsed or needs parsing
    const userData = typeof tempUserData === 'string' ? JSON.parse(tempUserData) : tempUserData;
    console.log('✅ Creating user account...');

    // Now create the user
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      role: userData.role,
      village: userData.village,
      address: userData.address,
      isVerified: true
    });

    console.log('✅ User created:', user.email);

    // Delete OTP and temp data from Redis
    await cacheService.deleteOTP(email);
    await cacheService.del(`temp_user:${email}`);

    const token = generateToken(user._id);
    
    console.log('✅ Sending success response\n');
    
    res.json({ 
      message: 'Account created and verified successfully!',
      token, 
      user: { id: user._id, name: user.name, role: user.role } 
    });
  } catch (error) {
    console.error('❌ Verify OTP Error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    
    console.log('Login attempt:', { email, phone, password: '***' });
    
    // Accept either email or phone
    const identifier = email || phone;
    
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide email/phone and password' });
    }

    // Rate limiting
    const canProceed = await cacheService.checkRateLimit(`login:${identifier}`, 5, 300);
    if (!canProceed) {
      return res.status(429).json({ message: 'Too many login attempts. Try again later.' });
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: identifier }
      ]
    });

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your account first' });
    }

    const token = generateToken(user._id);
    
    // Cache user data
    await cacheService.cacheUser(user._id.toString(), {
      id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
      phone: user.phone
    });
    
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`\n🔍 Forgot Password request received for: ${email}`);
    
    // Rate limiting
    const canProceed = await cacheService.checkRateLimit(`forgot:${email}`, 3, 300);
    if (!canProceed) {
      console.log(`⚠️ Rate limit hit for ${email}`);
      return res.status(429).json({ message: 'Too many attempts. Try again later.' });
    }
    
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ User NOT found in database: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`✅ User found: ${user._id}`);

    const otp = emailService.generateOTP();
    
    // Store OTP in Redis
    console.log(`📦 Storing OTP in Redis...`);
    const redisResult = await cacheService.setOTP(email, otp, 300);
    console.log(`📦 Redis storage status: ${redisResult ? 'Success' : 'FAILURE'}`);

    // Send OTP via Email
    console.log(`📧 Attempting to send OTP email to ${email}...`);
    const emailResult = await emailService.sendEmailOTP(email, otp);
    
    if (emailResult.success) {
      console.log(`✅ Password reset OTP sent successfully to ${email}`);
      res.json({ message: 'OTP sent to your email', userId: user._id });
    } else {
      console.log(`❌ EMAIL SENDING FAILED: ${emailResult.error}`);
      // For development: Log OTP to console if email fails
      console.log('\n🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴');
      console.log('⚠️  EMAIL SERVICE NOT CONFIGURED OR FAILED - PASSWORD RESET');
      console.log('📧 Email:', email);
      console.log('🔑 OTP:', otp);
      console.log('👤 User ID:', user._id);
      console.log('⏰ Valid for: 5 minutes');
      console.log('🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴\n');
      
      res.json({ 
        message: 'OTP generated. Check console for OTP.', 
        userId: user._id,
        devMode: true,
        otp: otp // Only for development
      });
    }
  } catch (error) {
    console.error('❌ Forgot Password Error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get OTP from Redis
    const cachedOTP = await cacheService.getOTP(user.email);
    if (!cachedOTP || cachedOTP.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = newPassword;
    await user.save();

    // Delete OTP from Redis
    await cacheService.deleteOTP(user.email);

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, village, address, profilePic } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, village, address, profilePic },
      { new: true }
    ).select('-password');
    
    // Update cached user
    await cacheService.cacheUser(user._id.toString(), {
      id: user._id,
      name: user.name,
      role: user.role,
      phone: user.phone
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

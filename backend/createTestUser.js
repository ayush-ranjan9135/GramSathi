require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if test user exists
    const existingUser = await User.findOne({ phone: '9999999999' });
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // Create test user
    const testUser = await User.create({
      name: 'Test Admin',
      phone: '9999999999',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
      village: 'Test Village',
      address: 'Test Address',
      isVerified: true
    });

    console.log('Test user created:', testUser.name);
    console.log('Login with: Phone: 9999999999, Password: password123');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

createTestUser();
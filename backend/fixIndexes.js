require('dotenv').config();
const mongoose = require('mongoose');

const fixIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Drop old phone index
    try {
      await usersCollection.dropIndex('phone_1');
      console.log('✅ Dropped phone_1 index');
    } catch (error) {
      console.log('Phone index already dropped or does not exist');
    }

    // Create email index
    try {
      await usersCollection.createIndex({ email: 1 }, { unique: true });
      console.log('✅ Created email unique index');
    } catch (error) {
      console.log('Email index already exists');
    }

    console.log('✅ Database indexes updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixIndexes();

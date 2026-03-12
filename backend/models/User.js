import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, sparse: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['villager', 'admin', 'worker', 'superadmin'],
    default: 'villager'
  },
  village: { type: String },
  address: { type: String },
  profilePic: { type: String },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);

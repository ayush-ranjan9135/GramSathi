import mongoose from 'mongoose';

const welfareSchemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Pension', 'Housing', 'Education', 'Agriculture', 'Healthcare', 'Other'],
    required: true 
  },
  eligibility: { type: String, required: true },
  documents: { type: String, required: true },
  benefits: { type: String, required: true },
  applyLink: { type: String },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('WelfareScheme', welfareSchemeSchema);

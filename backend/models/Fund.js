const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
  schemeName: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['Infrastructure', 'Education', 'Healthcare', 'Sanitation', 'Agriculture', 'Other'],
    required: true 
  },
  source: { 
    type: String, 
    enum: ['Government', 'State', 'Central', 'Donation'],
    required: true 
  },
  description: { type: String },
  date: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fund', fundSchema);

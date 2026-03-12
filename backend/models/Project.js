import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Road', 'Drainage', 'Building', 'Water Supply', 'Electricity', 'Other'],
    required: true 
  },
  budget: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Planned', 'Ongoing', 'Completed', 'Delayed'],
    default: 'Planned'
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  contractorName: { type: String },
  contractorContact: { type: String },
  photos: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Project', projectSchema);

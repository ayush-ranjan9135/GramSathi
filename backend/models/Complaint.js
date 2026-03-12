import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Water', 'Road', 'Electricity', 'Sanitation', 'Other'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  photos: [{ type: String }],
  address: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolutionNote: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Complaint', complaintSchema);

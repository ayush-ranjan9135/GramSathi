import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Complaint', 'Event', 'Project', 'Announcement', 'General'],
    required: true 
  },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  recipientRole: { type: String, enum: ['all', 'villager', 'admin', 'worker'] },
  isRead: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);

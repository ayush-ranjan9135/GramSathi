import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Meeting', 'Health Camp', 'Cultural Program', 'Vaccination Drive', 'Other'],
    required: true 
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  organizer: { type: String },
  image: { type: String },
  notificationSent: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Event', eventSchema);

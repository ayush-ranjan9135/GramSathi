const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

exports.createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create({
      ...req.body,
      userId: req.user.id
    });
    
    // Try to create notification, but don't fail if it errors
    try {
      await Notification.create({
        title: 'New Complaint',
        message: `New complaint: ${complaint.title}`,
        type: 'Complaint',
        recipientRole: 'admin'
      });
    } catch (notifError) {
      console.log('Notification creation failed:', notifError.message);
    }

    res.status(201).json(complaint);
  } catch (error) {
    console.error('Complaint creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const filter = req.user.role === 'villager' ? { userId: req.user.id } : {};
    const complaints = await Complaint.find(filter)
      .populate('userId', 'name phone')
      .populate('assignedTo', 'name')
      .sort('-createdAt');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name phone')
      .populate('assignedTo', 'name');
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignComplaint = async (req, res) => {
  try {
    const { workerId } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedTo: workerId, status: 'Assigned', updatedAt: Date.now() },
      { new: true }
    );

    await Notification.create({
      title: 'Complaint Assigned',
      message: `You have been assigned complaint: ${complaint.title}`,
      type: 'Complaint',
      recipients: [workerId]
    });

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComplaintStats = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const statusStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ categoryStats: stats, statusStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

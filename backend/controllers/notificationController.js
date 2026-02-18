const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { recipients: req.user.id },
        { recipientRole: req.user.role },
        { recipientRole: 'all' }
      ]
    }).sort('-createdAt').limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      $addToSet: { isRead: req.user.id }
    });
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const notification = await Notification.create({
      ...req.body,
      type: 'Announcement'
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

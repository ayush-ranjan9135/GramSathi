const Event = require('../models/Event');
const Notification = require('../models/Notification');

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user.id
    });

    try {
      await Notification.create({
        title: 'New Event',
        message: `${event.title} on ${event.date}`,
        type: 'Event',
        recipientRole: 'all'
      });
    } catch (notifError) {
      console.log('Notification creation failed:', notifError.message);
    }

    res.status(201).json(event);
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort('date');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } }).sort('date').limit(5);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

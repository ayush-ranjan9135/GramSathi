import Event from '../models/Event.js';
import Notification from '../models/Notification.js';
import cacheService from '../services/cacheService.js';

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user.id
    });

    // Clear events cache
    await cacheService.clearPattern('events');
    await cacheService.clearPattern('dashboard');

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

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort('date');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const cacheKey = cacheService.keys.upcomingEvents();
    
    // Try cache first
    let cachedEvents = await cacheService.get(cacheKey);
    if (cachedEvents) {
      return res.json(cachedEvents);
    }
    
    const events = await Event.find({ date: { $gte: new Date() } }).sort('date').limit(5);
    
    // Cache for 10 minutes
    await cacheService.set(cacheKey, events, 600);
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Clear events cache
    await cacheService.clearPattern('events');
    await cacheService.clearPattern('dashboard');
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    
    // Clear events cache
    await cacheService.clearPattern('events');
    await cacheService.clearPattern('dashboard');
    
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

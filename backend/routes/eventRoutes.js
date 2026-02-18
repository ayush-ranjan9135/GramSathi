const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getUpcomingEvents, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin', 'superadmin'), createEvent);
router.get('/', getEvents);
router.get('/upcoming', getUpcomingEvents);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateEvent);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteEvent);

module.exports = router;

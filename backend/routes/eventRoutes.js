import express from 'express';
import { createEvent, getEvents, getUpcomingEvents, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('admin', 'superadmin'), createEvent);
router.get('/', getEvents);
router.get('/upcoming', getUpcomingEvents);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateEvent);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteEvent);

export default router;

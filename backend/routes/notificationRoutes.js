import express from 'express';
import { getNotifications, markAsRead, createAnnouncement } from '../controllers/notificationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.post('/announcement', protect, authorize('admin', 'superadmin'), createAnnouncement);

export default router;

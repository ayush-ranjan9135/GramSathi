import express from 'express';
import { createComplaint, getComplaints, getComplaint, updateComplaint, assignComplaint, getComplaintStats } from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createComplaint);
router.get('/', protect, getComplaints);
router.get('/stats', protect, authorize('admin', 'superadmin'), getComplaintStats);
router.get('/:id', protect, getComplaint);
router.put('/:id', protect, authorize('admin', 'worker', 'superadmin'), updateComplaint);
router.put('/:id/assign', protect, authorize('admin', 'superadmin'), assignComplaint);

export default router;

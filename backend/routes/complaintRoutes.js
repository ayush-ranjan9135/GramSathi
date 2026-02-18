const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, getComplaint, updateComplaint, assignComplaint, getComplaintStats } = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createComplaint);
router.get('/', protect, getComplaints);
router.get('/stats', protect, authorize('admin', 'superadmin'), getComplaintStats);
router.get('/:id', protect, getComplaint);
router.put('/:id', protect, authorize('admin', 'worker', 'superadmin'), updateComplaint);
router.put('/:id/assign', protect, authorize('admin', 'superadmin'), assignComplaint);

module.exports = router;

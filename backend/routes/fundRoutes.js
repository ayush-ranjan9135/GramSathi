import express from 'express';
import { createFund, getFunds, getFundStats } from '../controllers/fundController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('admin', 'superadmin'), createFund);
router.get('/', getFunds);
router.get('/stats', getFundStats);

export default router;

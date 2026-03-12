import express from 'express';
import { createScheme, getSchemes, getScheme, updateScheme, deleteScheme } from '../controllers/schemeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('admin', 'superadmin'), createScheme);
router.get('/', getSchemes);
router.get('/:id', getScheme);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateScheme);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteScheme);

export default router;

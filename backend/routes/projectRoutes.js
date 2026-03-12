import express from 'express';
import { createProject, getProjects, getProject, updateProject, deleteProject, getProjectStats } from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('admin', 'superadmin'), createProject);
router.get('/', getProjects);
router.get('/stats', protect, authorize('admin', 'superadmin'), getProjectStats);
router.get('/:id', getProject);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateProject);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteProject);

export default router;

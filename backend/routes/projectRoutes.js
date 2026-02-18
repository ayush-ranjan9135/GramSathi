const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProject, updateProject, deleteProject, getProjectStats } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin', 'superadmin'), createProject);
router.get('/', getProjects);
router.get('/stats', protect, authorize('admin', 'superadmin'), getProjectStats);
router.get('/:id', getProject);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateProject);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteProject);

module.exports = router;

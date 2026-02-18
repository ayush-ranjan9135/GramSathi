const express = require('express');
const router = express.Router();
const { createScheme, getSchemes, getScheme, updateScheme, deleteScheme } = require('../controllers/schemeController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin', 'superadmin'), createScheme);
router.get('/', getSchemes);
router.get('/:id', getScheme);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateScheme);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteScheme);

module.exports = router;

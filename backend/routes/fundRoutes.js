const express = require('express');
const router = express.Router();
const { createFund, getFunds, getFundStats } = require('../controllers/fundController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin', 'superadmin'), createFund);
router.get('/', getFunds);
router.get('/stats', getFundStats);

module.exports = router;

const express = require('express');
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// This route is protected
router.get('/:id/status', authMiddleware.protect, jobController.getJobStatus);

router.get("/:id/error-report",authMiddleware.protect,jobController.downloadErrorReport);

module.exports = router;
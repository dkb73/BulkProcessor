const express = require('express');
const salesController = require('../controllers/salesController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// This route is protected, only logged-in users can access it.
// We are defining it at the root ('/') because we will mount it on '/api/sales-data' in index.js
router.get('/', authMiddleware.protect, salesController.getSalesData);

module.exports = router;
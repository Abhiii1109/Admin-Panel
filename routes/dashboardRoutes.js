const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

/**
 * Dashboard Routes
 */
router.get('/', isAuthenticated, dashboardController.showDashboard);

module.exports = router;

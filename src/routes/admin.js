const express = require('express');
const { authenticate, restrictTo } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const router = express.Router();

// Apply authentication and role restriction (admin only)
router.use(authenticate, restrictTo('admin'));

// Route to render admin dashboard
router.get('/dashboard', adminController.getDashboard);

// Route to handle new department creation
router.post('/departments', adminController.createDepartment);

// Route to handle new service creation
router.post('/services', adminController.createService);

module.exports = router;
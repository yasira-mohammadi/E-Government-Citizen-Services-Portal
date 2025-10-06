const express = require('express');
const { authenticate, restrictTo } = require('../middleware/auth');
const officerController = require('../controllers/officerController');
const router = express.Router();

// Apply authentication and role restriction (officer or department_head)
router.use(authenticate, restrictTo('officer', 'department_head'));

// Route to render dashboard (officer or department head)
router.get('/dashboard', officerController.getDashboard);

// Route to render request details page
router.get('/requests/:id', officerController.getRequestDetails);

// Route to handle request status updates
router.post('/requests/:id', officerController.updateRequestStatus);

// Route to handle request assignment (department head only)
router.post('/requests/:request_id/assign', officerController.assignRequest);

module.exports = router;
const express = require('express');
const { authenticate, restrictTo } = require('../middleware/auth');
const citizenController = require('../controllers/citizenController');
const router = express.Router();

// Apply authentication and role restriction (citizen only)
router.use(authenticate, restrictTo('citizen'));

// Route to render citizen dashboard
router.get('/dashboard', citizenController.getDashboard);

// Route to render citizen requests page
router.get('/requests', citizenController.getRequests);

// Route to render submit request page
router.get('/submit', citizenController.getSubmit);

// Route to handle new request submission
router.post('/requests', citizenController.createRequest);

// Route to handle document upload for a request
router.post('/requests/:request_id/documents', citizenController.uploadDocument);

// Route to handle payment for a request (simulated)
router.post('/requests/:request_id/pay', citizenController.payRequest);

// Route to render citizen profile page
router.get('/profile', citizenController.getProfile);

module.exports = router;
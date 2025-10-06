const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Route to render the registration page
router.get('/register', authController.getRegister);

// Route to handle user registration
router.post('/register', authController.register);

// Route to render the login page
router.get('/login', authController.getLogin);

// Route to handle user login
router.post('/login', authController.login);

// Route to handle user logout
router.get('/logout', authController.logout);

module.exports = router;
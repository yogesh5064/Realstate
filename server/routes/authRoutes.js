const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    verifyOTP, 
    getProfile, 
    updateProfile,
    resetPassword 
} = require('../controllers/authController');

// Middleware import
const { protect } = require('../middleware/authMiddleware');

// --- 1. Authentication Routes ---
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);

// --- 2. Profile Management Routes ---
// ✅ Note: protect ke aage brackets () nahi lagane hain
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// --- 3. Security Routes ---
router.put('/reset-password', protect, resetPassword);

module.exports = router;
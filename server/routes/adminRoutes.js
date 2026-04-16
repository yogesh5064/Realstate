const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Property = require('../models/Property');
const { protect } = require('../middleware/authMiddleware');

// 🛡️ Admin Middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Access Denied: Admins Only!" });
  }
};

// --- 1. Get All Registered Users (Includes isApproved Status) ---
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
    
    const usersWithCounts = await Promise.all(users.map(async (user) => {
      const count = await Property.countDocuments({ seller: user._id });
      return { ...user._doc, propertiesCount: count };
    }));

    res.json(usersWithCounts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

// --- 2. Block/Unblock User ---
router.patch('/users/:id/block', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();
    
    res.json({ 
      message: `User ${user.isBlocked ? 'Blocked' : 'Unblocked'} successfully`, 
      isBlocked: user.isBlocked 
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating block status", error: err.message });
  }
});

// --- 🔥 3. NEW: Approve/Unapprove Professional Dealer ---
// Full path: PATCH /api/admin/users/:id/approve
router.patch('/users/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Sirf professional dealers ko hi approve karne ki zaroorat hai
    if (user.role !== 'professional') {
      return res.status(400).json({ message: "Only professional accounts need approval" });
    }

    user.isApproved = !user.isApproved; // Toggle approval status
    await user.save();
    
    res.json({ 
      message: `Dealer ${user.isApproved ? 'Approved' : 'Unapproved'} successfully`, 
      isApproved: user.isApproved 
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating approval status", error: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware'); 
const upload = require('../middleware/uploadMiddleware');

// Public Routes
router.get('/', propertyController.getAllProperties);

// Protected Routes (Auth Required)
router.get('/my-properties', protect, propertyController.getMyProperties);
router.get('/wishlist', protect, propertyController.getWishlist);

// Post Property
router.post('/', protect, upload.array('images', 5), propertyController.createProperty);

// 🔥 MISSING ROUTE ADDED: Update Property
// Frontend se jab axios.put('/properties/:id') aayega, toh ye chalega
router.put('/:id', protect, upload.array('images', 5), propertyController.updateProperty);

// Dynamic Routes
router.patch('/:id/status', protect, propertyController.togglePropertyStatus);
router.post('/:id/wishlist', protect, propertyController.toggleWishlist);
router.delete('/:id', protect, propertyController.deleteProperty);

module.exports = router;
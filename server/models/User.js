const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  
  // Role: Buyer (casual), Seller (professional), or Admin
  role: { 
    type: String, 
    enum: ['casual', 'professional', 'admin'], 
    default: 'casual' 
  },
  
  // 🔥 NEW: Professional Dealers ke liye Approval System
  // Default 'false' rahega, Admin approve karega tabhi 'true' hoga
  isApproved: { 
    type: Boolean, 
    default: false 
  },

  // Block status (Fraud rokne ke liye)
  isBlocked: { 
    type: Boolean, 
    default: false 
  },
  
  // Verification (OTP based)
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  otp: { type: String },
  otpExpires: { type: Date },

  // Wishlist for Buyers
  wishlist: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property' 
  }],

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', UserSchema);
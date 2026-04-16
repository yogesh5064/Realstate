const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOTP = require('../config/email');

// --- 1. Register & Send OTP ---
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    let user = await User.findOne({ email });
    
    if (user && user.isVerified) {
      return res.status(400).json({ message: "User already exists and is verified" });
    }

    if (user && user.isBlocked) {
      return res.status(403).json({ message: "This account has been blocked due to policy violations." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; 

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (user) {
      user.name = name;
      user.password = hashedPassword;
      user.phone = phone;
      user.role = role;
      user.otp = otp;
      user.otpExpires = otpExpires;
    } else {
      user = new User({ name, email, password: hashedPassword, phone, role, otp, otpExpires });
    }

    await user.save();
    await sendOTP(email, otp);
    res.status(200).json({ message: "OTP sent to your email. Please verify." });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// --- 2. Verify OTP ---
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isBlocked) {
      return res.status(403).json({ message: "Action denied. This account is blocked." });
    }

    if (String(user.otp) !== String(otp)) return res.status(400).json({ message: "Invalid OTP code" });
    if (user.otpExpires < Date.now()) return res.status(400).json({ message: "OTP expired" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        phone: user.phone,
        isBlocked: user.isBlocked 
      },
      message: "Verified!"
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// --- 3. Login ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !user.isVerified) {
        return res.status(400).json({ message: "Invalid Credentials or Not Verified" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ 
        message: "Bhai, aapka account block ho gaya hai rules todne ki wajah se!" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        phone: user.phone,
        isBlocked: user.isBlocked 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// --- 4. Get Profile ---
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId).select('-password').populate('wishlist'); 
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been suspended." });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Profile Fetch Error" });
  }
};

// --- 5. Update Profile ---
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isBlocked) {
      return res.status(403).json({ message: "Blocked users cannot update profile." });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    const updatedUser = await user.save();
    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      isBlocked: updatedUser.isBlocked
    });
  } catch (err) {
    res.status(500).json({ message: "Profile Update Error" });
  }
};

// --- 6. Reset Password ---
exports.resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isBlocked) {
      return res.status(403).json({ message: "Account suspended. Password reset disabled." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.status(200).json({ message: "Password updated successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Password Reset Error", error: err.message });
  }
};
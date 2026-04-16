const jwt = require('jsonwebtoken');
const User = require('../models/User'); // 🔥 User Model import kiya check karne ke liye

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Token nikaalein
      token = req.headers.authorization.split(' ')[1];

      // 2. Token verify karein
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Database se latest user data fetch karein (Role aur Block status ke liye)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      // 🔥 🛑 MAIN CHECK: Agar user block hai toh use aage mat jaane do
      if (user.isBlocked) {
        return res.status(403).json({ 
          message: "Access Denied: Your account has been blocked for violating rules!" 
        });
      }

      // 4. Request object mein user aur role set karein
      req.user = user; 
      next();

    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token found" });
  }
};
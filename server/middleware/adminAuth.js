const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Access Denied: Admins Only!" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Please authenticate as admin." });
  }
};

module.exports = adminAuth;
// middlewares/verifyUserToken.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyUserToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // ✅ only store the ID in req.user
    req.user = { id: user._id.toString() };

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { verifyUserToken };

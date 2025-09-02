const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyUserToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        // clean up DB so user can login again
        const user = await User.findOne({ activeToken: token });
        if (user) {
          user.activeToken = null;
          await user.save();
        }
        return res.status(401).json({ message: 'Session expired. Please log in again.' });
      }
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user || user.activeToken !== token) {
      return res.status(401).json({ message: 'Session expired or logged in elsewhere' });
    }

    req.user = { id: user._id.toString() };
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { verifyUserToken };

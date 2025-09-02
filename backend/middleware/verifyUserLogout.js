// middlewares/verifyLogoutToken.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyLogoutToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next(); // no token, still allow cleanup

  try {
    // Try to decode, even if expired
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    if (decoded?.id) {
      req.user = { id: decoded.id };
    } else {
      // fallback: find user by activeToken
      const user = await User.findOne({ activeToken: token });
      if (user) req.user = { id: user._id.toString() };
    }
  } catch (err) {
    console.log("Logout token decode failed:", err.message);
  }

  next(); // always continue
};

module.exports = { verifyLogoutToken };

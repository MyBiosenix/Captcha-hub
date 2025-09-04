const User = require('../models/User');
const jwt = require('jsonwebtoken');

const citizenLogin = async (req, res) => {
  try {
    const { email, password, force } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Email or Password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account is deactivated. Please contact admin.' });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid Email or Password' });
    }

    // Check if user is already logged in
    if (user.activeToken && !force) {
      return res.status(409).json({
        message: 'You are already logged in on another device. Click login again to continue from this device.',
        requireForce: true
      });
    }

    // If force = true, clear old token
    if (force) {
      user.activeToken = null;
    }

    // Generate new token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    user.activeToken = token;
    await user.save();

    res.status(200).json({
      message: 'Login Successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        package: user.package,
        admin: user.admin,
        isActive: user.isActive
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const citizenLogout = async (req, res) => {
  try {
    let user = null;

    // Case 1: token was valid → req.user is available
    if (req.user?.id) {
      user = await User.findById(req.user.id);
    }

    // Case 2: token expired but still in Authorization header
    if (!user) {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        user = await User.findOne({ activeToken: token });
      }
    }

    if (user) {
      user.activeToken = null;
      await user.save();
    }

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error("Logout error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const forceLogoutAll = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.activeToken = null;
    await user.save();

    res.json({ message: "All sessions logged out. Please login again." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { citizenLogin, citizenLogout, forceLogoutAll };

const User = require("../models/User");

exports.checkActiveUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("isActive validTill");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Your account has been deactivated by admin." });
    }

    if (user.validTill && new Date(user.validTill) < new Date()) {
      return res.status(403).json({ message: "Your account has expired. Please renew your plan." });
    }

    next();
  } catch (err) {
    console.error("checkActiveUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

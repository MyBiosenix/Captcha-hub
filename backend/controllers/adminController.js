const Admin = require('../models/Admin');
const User = require('../models/User')

const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword.length < 5) {
      return res.status(400).json({ message: 'Password must be at least 5 characters long' });
    }
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (admin.password !== currentPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing admin password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDashboardStats = async( req, res ) => {
  try{
    const totalUsers = await User.countDocuments();
    const totalAdmins = await Admin.countDocuments();
    const activeUsers = await User.countDocuments({ isActive:true });
    const InactiveUsers = await User.countDocuments({ isActive:false });

    res.status(200).json({
      totalAdmins,
      totalUsers,
      activeUsers,
      InactiveUsers
    });
  }
  catch(err){
    res.status(500).json({ message: err.message });
  }
}

module.exports = { changeAdminPassword, getDashboardStats };
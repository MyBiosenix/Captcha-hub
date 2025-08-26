const User = require('../models/User');
const jwt = require('jsonwebtoken');

const citizenLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Email or Password' });
        }

        // Check active status
        if (!user.isActive) {
            return res.status(403).json({ message: 'Your account is deactivated. Please contact admin.' });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid Email or Password' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

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

module.exports = { citizenLogin };

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = await Admin.findById(decoded.id).select('-password');
        if (!req.admin) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

const isSuperAdmin = (req, res, next) => {
    if (req.admin.role !== 'superadmin') {
        return res.status(403).json({ message: 'Access denied: Superadmin only' });
    }
    next();
};

module.exports = { verifyToken, isSuperAdmin };
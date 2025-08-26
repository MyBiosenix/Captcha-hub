const express = require('express');
const router = express.Router();
const { addsubadmin, getAllAdmins, deleteAdmin, getAdminName, editSubAdmin } = require('../controllers/addSubAdminController');
const { verifyToken, isSuperAdmin } = require('../middleware/authMiddleware');
const { changeAdminPassword, getDashboardStats } = require('../controllers/adminController');
const { EditUser, updateCaptchaSettings } = require('../controllers/EditUserController')

router.post('/add-subadmin', verifyToken, isSuperAdmin, addsubadmin);

router.get('/all', verifyToken, isSuperAdmin, getAllAdmins);

router.delete('/:id', verifyToken, isSuperAdmin, deleteAdmin);

router.get('/alladmins', getAdminName);

router.put('/change-password',verifyToken ,changeAdminPassword);

router.get('/stats', getDashboardStats);

router.get('/all-users',verifyToken,EditUser);
router.put('/update-captcha-settings/:id',verifyToken, updateCaptchaSettings);

router.put('/edit-subadmin/:id', verifyToken, isSuperAdmin, editSubAdmin);

module.exports = router;

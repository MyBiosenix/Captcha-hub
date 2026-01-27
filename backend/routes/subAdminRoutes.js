const express = require('express');
const router = express.Router();

const {login,getDashStats, getMyUsers, getActiveUsers, getInActiveUsers} = require('../controllers/SubAdminController');
const {verifyToken} = require('../middleware/authmiddleware')

router.post('/login',login);
router.get('/get-dashstats',verifyToken,getDashStats);
router.get('/get-users',verifyToken,getMyUsers);
router.get('/get-activeusers',verifyToken,getActiveUsers);
router.get('/get-inactiveusers',verifyToken,getInActiveUsers);

module.exports = router;
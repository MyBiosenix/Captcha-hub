const express = require('express');
const router = express.Router();
const { citizenLogin, citizenLogout, forceLogoutAll } = require('../controllers/citizenController');
const { verifyUserToken } = require('../middleware/userAuth');
const { verifyLogoutToken } = require('../middleware/verifyUserLogout')

router.post('/login', citizenLogin);
router.post('/logout',verifyLogoutToken, citizenLogout);

router.post('/force-logout', verifyLogoutToken, forceLogoutAll);

module.exports = router;

const express = require('express');
const router = express.Router();

const { addUser, getAllUsers, deleteUser, edituser, activateUser, DeActivateUser, getInactiveUsers, getActiveUsers, changeUserPass} = require('../controllers/UserController');
const { generateCaptcha, verifyCaptcha, getMyStats } = require('../controllers/CaptchaDeals');
const { mypayment,getAllRequests,getUserPaymentRequests,deletereqs } = require('../controllers/paymentController')
const { checkActiveUser } = require('../middleware/checkActiveUser');
const { verifyUserToken } = require('../middleware/userAuth');

router.post('/create-user', addUser);
router.put('/change-pass', verifyUserToken, changeUserPass);
router.get('/all', getAllUsers);
router.delete('/:id', deleteUser);
router.put('/edit-user/:id',edituser)
router.put('/:id/activate', activateUser);
router.put('/:id/deactivate', DeActivateUser);
router.get('/inactive-users', getInactiveUsers);
router.get('/active-users',getActiveUsers);

router.get("/generate", verifyUserToken,checkActiveUser, generateCaptcha);
router.post("/verify", verifyUserToken, checkActiveUser, verifyCaptcha);

router.get("/stats", verifyUserToken,checkActiveUser, getMyStats);

router.post('/create-payment-req', mypayment);
router.get('/all-reqs',getAllRequests);
router.get('/user-reqs', verifyUserToken,getUserPaymentRequests);
router.delete('/pay/:id',deletereqs);

module.exports = router;
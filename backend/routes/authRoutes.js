const express = require('express');
const router = express.Router();
const { login } = require('../controllers/loginController');
const { captchatype,getAllCaptchas,deleteCaptcha,editCaptcha } = require('../controllers/CaptchaController');


router.post('/login', login);
router.post('/captcha-type',captchatype);
router.get('/all-captchas',getAllCaptchas);
router.delete('/:id',deleteCaptcha);
router.put('/edit-captcha/:id',editCaptcha);

module.exports = router;

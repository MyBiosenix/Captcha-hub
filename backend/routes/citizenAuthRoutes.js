const express = require('express');
const router = express.Router();
const { citizenLogin } = require('../controllers/citizenController');

router.post('/login', citizenLogin);

module.exports = router;

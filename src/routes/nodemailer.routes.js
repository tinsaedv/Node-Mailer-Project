const express = require('express');
const { main, checkOtp } = require('../controllers/nodemailer.controller');

const router = express.Router();

router.post('/send', main).get('/check-otp', checkOtp);

module.exports = router;

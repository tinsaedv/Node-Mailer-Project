const express = require('express');
const { main } = require('../controllers/nodemailer.controller');

const router = express.Router();

router.post('/send', main);

module.exports = router;

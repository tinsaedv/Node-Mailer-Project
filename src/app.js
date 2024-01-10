require('dotenv').config();

const express = require('express');

const router = require('./routes/nodemailer.routes');

const app = express();

app.use('/api', router);

module.exports = app;

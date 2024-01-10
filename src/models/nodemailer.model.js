const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  otpCode: {
    type: String,
  },
});

const Mail = mongoose.model('Mail', mailSchema);

module.exports = Mail;

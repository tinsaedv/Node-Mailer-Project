const nodemailer = require('nodemailer');
const Mail = require('../models/nodemailer.model');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

async function main(req, res) {
  const { email } = req.body;

  const otpCode = Math.floor(Math.random() * 10000);

  const mailOptions = {
    from: 'no-reply@yourdomain.com', // sender address
    to: email, // receiver email
    subject: 'Your Email Verification Code', // Subject line
    text: `Your email verification code is: ${otpCode}`, // plain text body
    html: `
      <p>Hello,</p>
      <p>Your email verification code is:</p>
      <h3>${otpCode}</h3>
      <p>Please enter this code to verify your email address.</p>
      <p>If you did not request this, please ignore this email.</p>
    `, // html body
  };

  // send mail with defined transport object
  const info = await transporter.sendMail(mailOptions);
  if (info) {
    console.log('Message sent: %s', info.messageId);
  } else {
    console.error('Error sending email');
  }

  console.log('Message sent: %s', info.messageId);

  try {
    const userMail = await Mail.create({
      email: email,
      otpCode: otpCode,
    });

    userMail.save();
    res.status(200).json({ message: 'otp code sent' });
  } catch (err) {
    console.error('err ', err.message);
  }
}

async function checkOtp(req, res) {
  const { email, otpCode } = req.body;
  try {
    const user = await Mail.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }

    if (user.otpCode === otpCode) {
      return res.status(200).json({ message: 'otp code is correct' });
    } else {
      return res.status(404).json({ message: 'otp code is incorrect' });
    }
  } catch (err) {
    console.error('err ', err.message);
  }
}

module.exports = { main, checkOtp };

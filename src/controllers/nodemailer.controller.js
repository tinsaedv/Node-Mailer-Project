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

console.log(process.env.EMAIL);
// async..await is not allowed in global scope, must use a wrapper
async function main(req, res) {
  const { userEmail } = req.params;

  const otpCode = Math.floor(Math.random() * 10000);

  const mailOptions = {
    from: 'no-reply@yourdomain.com', // sender address
    to: userEmail, // receiver email
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
      email: userEmail,
      otpCode: otpCode,
    });

    userMail.save();
  } catch (err) {
    console.error('err ', err.message);
  }
}

async function checkOtp(req, res) {
  const { userEmail, otpCode } = req.params;
  try {
    const user = await Mail.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    if (user.otpCode === otpCode) {
      console.log('otp code is correct');
    }

    return res.status(200).json({ message: 'otp code is correct' });
  } catch (err) {
    console.error('err ', err.message);
  }
}

module.exports = { main, checkOtp };

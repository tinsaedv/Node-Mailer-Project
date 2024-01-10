const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

console.log(process.env.EMAIL);
// async..await is not allowed in global scope, must use a wrapper
async function main(userEmail) {
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
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}

// main('binukbe4@gmail.com', 'gohapo4862@tanlanav.com');
module.exports = { main };

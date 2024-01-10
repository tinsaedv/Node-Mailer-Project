// Importing the nodemailer module for sending emails
const nodemailer = require('nodemailer');
// Importing the Mail model from the specified location
const Mail = require('../models/nodemailer.model');

// Creating a transporter with the SMTP configuration
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL, // Email address for authentication
    pass: process.env.PASSWORD, // Password for authentication
  },
});

// Function to send email containing OTP for verification
async function main(req, res) {
  const { email } = req.body; // Extracting email from request body

  // Generating a random 4-digit OTP code
  const otpCode = Math.floor(Math.random() * 10000);

  // Constructing the mail options
  const mailOptions = {
    from: 'no-reply@yourdomain.com', // Sender's email address
    to: email, // Receiver's email address
    subject: 'Your Email Verification Code', // Subject of the email
    text: `Your email verification code is: ${otpCode}`, // Plain text body
    html: `
      <p>Hello,</p>
      <p>Your email verification code is:</p>
      <h3>${otpCode}</h3>
      <p>Please enter this code to verify your email address.</p>
      <p>If you did not request this, please ignore this email.</p>
    `, // HTML body
  };

  // Sending the email with the defined transport object
  const info = await transporter.sendMail(mailOptions);
  if (info) {
    console.log('Message sent: %s', info.messageId); // Logging the message ID if email is sent successfully
  } else {
    console.error('Error sending email'); // Logging error if email sending fails
  }

  console.log('Message sent: %s', info.messageId); // Logging the message ID

  try {
    // Creating a new record in the Mail model with email and OTP code
    const userMail = await Mail.create({
      email: email,
      otpCode: otpCode,
    });

    userMail.save(); // Saving the created record
    res.status(200).json({ message: 'otp code sent' }); // Sending success response
  } catch (err) {
    console.error('err ', err.message); // Logging error if creating and saving record fails
    return res.status(500).json({ message: 'Internal Server Error' }); // Sending error response
  }
}

// Function to check the validity of the OTP entered by the user
async function checkOtp(req, res) {
  const { email, otpCode } = req.body; // Extracting email and OTP code from request body
  try {
    // Finding a record in the Mail model with the specified email
    const user = await Mail.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'user not found' }); // Sending error response if user is not found
    }

    const currentTime = Date.now(); // Getting the current time
    const otpCreationTime = new Date(user.createdAt); // Getting the creation time of the OTP
    const timeDifference = currentTime - otpCreationTime; // Calculating the time difference in milliseconds

    if (timeDifference > 300000) {
      // Delete the expired OTP code from the database
      await Mail.deleteOne({ email: email });
      return res.status(404).json({ message: 'otp code expired' }); // Sending error response if OTP is expired
    }

    if (user.otpCode === otpCode) {
      // Delete the OTP code after successful verification
      await Mail.deleteOne({ email: email });
      return res.status(200).json({ message: 'otp code is correct' }); // Sending success response if OTP is correct
    } else {
      return res.status(404).json({ message: 'otp code is incorrect' }); // Sending error response if OTP is incorrect
    }
  } catch (err) {
    console.error('err ', err.message); // Logging error if database operation fails
    return res.status(500).json({ message: 'Internal Server Error' }); // Sending error response
  }
}

module.exports = { main, checkOtp }; // Exporting the main and checkOtp functions

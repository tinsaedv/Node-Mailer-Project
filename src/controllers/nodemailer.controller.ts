import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import Mail from '../models/nodemailer.model';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL as string,
    pass: process.env.PASSWORD as string,
  },
});

async function main(req: Request, res: Response): Promise<void> {
  const { email }: { email: string } = req.body;

  const otpCode: number = Math.floor(Math.random() * 10000);

  const mailOptions = {
    from: 'no-reply@yourdomain.com',
    to: email,
    subject: 'Your Email Verification Code',
    text: `Your email verification code is: ${otpCode}`,
    html: `
      <p>Hello,</p>
      <p>Your email verification code is:</p>
      <h3>${otpCode}</h3>
      <p>Please enter this code to verify your email address.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

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
    console.error('err ', (err as Error).message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function checkOtp(req: Request, res: Response) {
  const { email, otpCode }: { email: string; otpCode: string } = req.body;
  try {
    const user = await Mail.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }

    const currentTime = Date.now();
    const otpCreationTime = new Date(user.createdAt);
    const timeDifference = currentTime - otpCreationTime.getTime();

    if (timeDifference > 300000) {
      await Mail.deleteOne({ email: email });
      return res.status(404).json({ message: 'otp code expired' });
    }

    if (user.otpCode === otpCode) {
      user.verified = true;
      setTimeout(async () => {
        return await Mail.deleteOne({ email: email });
      }, 5000);
      await user.save();
      return res.status(200).json({ message: 'OTP code is Correct' });
    } else {
      return res.status(404).json({ message: 'OTP code is Incorrect' });
    }
  } catch (err) {
    console.error('err ', (err as Error).message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export { main, checkOtp };

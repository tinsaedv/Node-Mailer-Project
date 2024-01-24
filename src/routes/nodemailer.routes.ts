import express from 'express';
import { main, checkOtp } from '../controllers/nodemailer.controller';

const router = express.Router();

router.post('/send', main);
router.get('/check-otp', checkOtp);

export default router;

import * as mongoose from 'mongoose';

interface IMail {
  email: string;
  otpCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const mailSchema = new mongoose.Schema<IMail>(
  {
    email: {
      type: String,
    },
    otpCode: {
      type: String,
    },
  },
  { timestamps: true }
);

const Mail = mongoose.model<IMail>('Mail', mailSchema);

export default Mail;

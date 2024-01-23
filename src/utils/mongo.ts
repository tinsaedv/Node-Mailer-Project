import mongoose from 'mongoose';

const uri: string = process.env.MONGO_URI as string;

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready');
});

mongoose.connection.on('error', (err: Error) => {
  console.error(err);
});

async function mongoConnect(): Promise<void> {
  try {
    await mongoose.connect(uri);
  } catch (err) {
    console.error('err ', err);
  }
}

export default mongoConnect;

const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function mongoConnect() {
  try {
    await mongoose.connect(uri);
  } catch (err) {
    console.error('err ', err);
  }
}

module.exports = mongoConnect;

import * as http from 'http';
import * as dotenv from 'dotenv';
import app from './app';
import mongoConnect from './utils/mongo';

const server: http.Server = http.createServer(app);

// Start the server
async function startServer(): Promise<void> {
  try {
    await mongoConnect();
    server.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  } catch (error) {
    console.error(error);
  }
}

startServer();

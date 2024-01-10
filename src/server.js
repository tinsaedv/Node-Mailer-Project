const http = require('http');
require('dotenv').config();
const app = require('./app');
const mongoConnect = require('./utils/mongo');

const server = http.createServer(app);

// Start the server
async function startServer() {
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

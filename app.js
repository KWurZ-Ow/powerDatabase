import express from 'express';
import { createServer } from 'http';
import socketIO from 'socket.io';
import { connect } from 'mongoose';

// Connect to MongoDB
connect('your_mongodb_uri', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const server = createServer(app);
const io = socketIO(server);

const PORT = 3000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
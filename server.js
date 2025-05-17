const http = require('http');
const { Server } = require('socket.io');
const app = require('./app'); // your express app
const startCronJobs = require('./jobs/archiveNotes');

const server = http.createServer(app);

startCronJobs();


const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Socket connections
const logger = require('./utils/logger');

io.on('connection', (socket) => {
  logger.info(`🟢 A user connected: ${socket.id}`);

  socket.on('joinNoteRoom', (noteId) => {
    socket.join(noteId);
    logger.info(`User joined note room: ${noteId}`);
  });

  socket.on('leaveNoteRoom', (noteId) => {
    socket.leave(noteId);
    logger.info(`User left note room: ${noteId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`🔴 A user disconnected: ${socket.id}`);
  });
});

global.io = io; // So we can use it in controllers

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

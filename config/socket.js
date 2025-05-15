const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinNote', (noteId) => {
      socket.join(noteId);
    });

    socket.on('leaveNote', (noteId) => {
      socket.leave(noteId);
    });

    socket.on('noteUpdated', ({ noteId, updatedNote }) => {
      socket.to(noteId).emit('note:updated', updatedNote);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = setupSocket;

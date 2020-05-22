const { generateRoomCode } = require('@utilits');

module.exports = function (socketIO) {
  console.log('Handling sockets');

  const globalRooms = {}; // TODO: move to MongoDB

  socketIO.on('connection', function (socket) {
    console.log('Connected...');

    // TODO: decompose into separate handle,
    // remember to bind socket to the function
    socket.on('create-room', ({ username, code: room }) => {
      console.log('Creating new room:', room);
      // create room with specific code
      const users = { [socket.id]: username };
      globalRooms[room] = { users };

      socket.join(room);

      console.log(globalRooms);
    });

    // TODO: handle utmost 6 users only
    socket.on('new-user', ({ username, code: room }) => {
      console.log('Connecting new user:', username);
      socket.join(room);

      // add username to specific room in global room object
      console.log(globalRooms);
      globalRooms[room].users[socket.id] = username;

      // emit event back to FE about completion
      // TODO: create interface or function for SocketAnswer
      socket.to(room).broadcast.emit('new-user-connected', {
        answer: 'New user connected',
        payload: { username },
      });
    });

    // TODO: restrict user from being in different rooms at the same time
    socket.on('disconnect', () => {
      const room = Object.keys(globalRooms)
        .filter((key) => globalRooms[key].users[socket.id])
        .pop();

      if (room) {
        // notify all in the room that user left
        socket.to(room).broadcast.emit('user-disconnected', {
          answer: 'User disconnected',
          payload: {
            username: globalRooms[room].users[socket.id],
          },
        });

        // TODO: When moved to MongoDB, remove from database
        delete globalRooms[room].users[socket.id];
      }
    });
  });
};

const getUserBySocketId = (room, socketId) => {
  return room.users.find(user => user.socketId === socketId);
};

module.exports = getUserBySocketId;

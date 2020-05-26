const getUsersInRoom = require('./getUsersInRoom');

const reconnectUser = (socket, roomWithUser) => {
    return socket.emit('reconnect-user', {answer: 'Reconnection', payload: getUsersInRoom(roomWithUser)})
};
module.exports = reconnectUser;

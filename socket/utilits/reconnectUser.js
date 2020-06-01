const getUsernamesInRoom = require('./getUsersInRoom');

const reconnectUser = (socket, roomWithUser) => {
    return socket.emit('reconnect-user', {answer: 'Reconnection', payload: getUsernamesInRoom(roomWithUser)})
};
module.exports = reconnectUser;

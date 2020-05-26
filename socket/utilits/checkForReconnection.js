const reconnectUser = require('./reconnectUser');
const errorHandler = require('./errorHandler');

const checkForReconnection = (socket, roomWithUser, currentRoom) => {
    const room = roomWithUser.pop();
    if (room.name === currentRoom) {
        return reconnectUser(socket, room);
    }
    return errorHandler(
        socket,
        "Can not join to room! User is already in a room",
        roomWithUser.name
    );
};

module.exports = checkForReconnection;

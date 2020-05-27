const reconnectUser = require('./reconnectUser');
const errorHandler = require('./errorHandler');
const {errors} = require('../constants');

const checkForReconnection = (socket, roomWithUser, currentRoom) => {
    if (roomWithUser.name === currentRoom) {
        return reconnectUser(socket, roomWithUser);
    }
    return errorHandler(
        socket,
        errors.ALREADY_IN_ROOM,
        roomWithUser.name
    );
};

module.exports = checkForReconnection;

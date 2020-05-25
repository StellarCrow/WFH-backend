const {roomValidation} = require('../schemas/room.schema');
const log4js = require('log4js');
const logger = log4js.getLogger();

const createRoom = (socket, room, username) => {
    const createdRoom = {
        name: room,
        users: [{
            [socket.id]: username
        }],
        usersInRoom : 1,
        created_by: socket.id
    };
    const {value, error} = roomValidation.validate(createdRoom);

    if (error) {
       return null;
    }
    logger.info('Created room: ', room);
    return value;
};

module.exports = createRoom;

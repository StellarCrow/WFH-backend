const {Room} = require('../schemas/room.schema');
const log4js = require('log4js');
const logger = log4js.getLogger();

const addUserToRoom = async (socket, room, username) => {
    try {
        const result = await Room.findOneAndUpdate(
            { name: room, usersInRoom: { $lte: 5 } },
            {
                $push: {
                    users: {
                        username,
                        socketId: socket.id
                    },
                },
                $inc: { usersInRoom: +1 },
            },
            { new: true }
        );
        logger.info('User was added to room');
        return result;
    } catch (e) {
        return null;
    }
};
module.exports = addUserToRoom;

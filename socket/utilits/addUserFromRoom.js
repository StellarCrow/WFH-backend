const { Room } = require('../schemas/room.schema');
const log4js = require('log4js');
const logger = log4js.getLogger();

const deleteUserFromRoom = async (socket) => {
    try {
        const result =   Room.findOneAndUpdate(
            `this.users.contain(${socket.id})`,
            {$pull: {users: {[socket.id]: {$exists: true}}}, $inc: {usersInRoom: -1}});
        logger.info('User was deleted from room');
        return result;
    }catch(error) {
        return null;
    }

};

module.exports = deleteUserFromRoom;

const { Room } = require('../schemas/room.schema');
const log4js = require('log4js');
const logger = log4js.getLogger();

const deleteUserFromRoom = async (socket) => {
  try {
    const updatedRoom = await Room.findOneAndUpdate(
        {
            users: {$elemMatch: {socketId: socket.id}}
        },
        {
            $pull: {users: {socketId: socket.id}},
            $inc: {usersInRoom: -1},
        }
    );
    logger.info('User was deleted from room');
    return updatedRoom;
  } catch (error) {
    return null;
  }
};

module.exports = deleteUserFromRoom;

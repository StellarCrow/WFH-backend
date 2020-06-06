const {Room} = require('../schemas/room.schema');
const log4js = require('log4js');
const logger = log4js.getLogger();

const removeUserFromRoom = async (room, socket, username) => {
  const update = {
    $pull: {users: {socketId: socket.id, username: username}},
    $inc: {usersInRoom: -1},
  };

  try {
    const result = await Room.findOneAndUpdate({name: room}, update, {
      new: true,
    });
    logger.info('User was removed from room');
    return result;
  } catch (e) {
    return null;
  }
};
module.exports = removeUserFromRoom;

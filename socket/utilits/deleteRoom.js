const log4js = require('log4js');
const logger = log4js.getLogger();
const {Room} = require('../schemas/room.schema');

const deleteRoom = async (socket) => {
    const result = await Room.remove(
        {created_by: socket.id})
        .then(room => socket.to(room.name).broadcast.emit('room-deleted', {
                answer: 'Room was deleted!',
                payload: null
            }
        ));
    logger.info('Room was deleted!');
    return result;
};
module.exports = deleteRoom;

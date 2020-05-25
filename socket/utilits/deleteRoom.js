const {Room} = require('../schemas/room.schema');

const deleteRoom = async(socket) => {
    return await Room.remove({created_by: socket.id})
        .then(room => socket.to(room.name).broadcast.emit('room-deleted', {
                answer: 'Room was deleted!',
                payload: null
            }
        ));
};
module.exports = deleteRoom;

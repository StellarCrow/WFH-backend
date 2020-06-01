const {Room} = require('../schemas/room.schema');


const roomsWhereUser = async (socketId, username) => {
    return await Room.find({
        users: {$elemMatch: {socketId: socketId, username}}
    });
};
module.exports = roomsWhereUser;

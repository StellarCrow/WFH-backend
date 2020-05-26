const {Room} = require('../schemas/room.schema');


const roomsWhereUser = async (socketID, username) => {
    return await Room.find({users: {$elemMatch: {[socketID]: username}}})

};
module.exports = roomsWhereUser;

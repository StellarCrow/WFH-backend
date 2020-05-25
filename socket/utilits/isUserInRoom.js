const {Room} = require('../schemas/room.schema');


const isUserInRoom = async (socketID, username) => {
    return await Room.find({users: {$elemMatch: {[socketID]: username}}});
};
module.exports = isUserInRoom;

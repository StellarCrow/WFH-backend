const {Room} = require('../schemas/room.schema');

const isUserInRoom = async (socketID, username) => {
    const result = await Room.find({users: {$elemMatch : {[socketID]: username}}});
    console.log(result);
    console.log(socketID);
    return result;
};
module.exports = isUserInRoom;

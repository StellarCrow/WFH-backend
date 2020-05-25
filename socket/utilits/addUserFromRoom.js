const { Room } = require('../schemas/room.schema');

const deleteUserFromRoom = async (socket) => {
    return  Room.findOneAndUpdate(
        `this.users.contain(${socket.id})`,
        {$pull: {users: {[socket.id]: {$exists: true}}}, $inc: {usersInRoom: -1}});
};

module.exports = deleteUserFromRoom;

const {Room} = require('../schemas/room.schema');

const addUserToRoom = async(socket, room, username) => {
    try {
       return await Room.findOneAndUpdate(
            {name: room, usersInRoom: {$lte: 5}},
            {$push: {users: {[socket.id]: username}}, $inc: {usersInRoom: +1}},
            {new: true});
    } catch (e) {
        return null;
    }
};
module.exports = addUserToRoom;

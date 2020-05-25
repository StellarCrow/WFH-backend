const {roomValidation} = require('../schemas/room.schema');
const createRoom = (socket, room, username) => {
    const createdRoom = {
        name: room,
        users: [{
            [socket.id]: username
        }],
        usersInRoom : 1,
        created_by: socket.id
    };
    const {value, error} = roomValidation.validate(createdRoom);

    if (error) {
       return null;
    }
    return value;
};

module.exports = createRoom;

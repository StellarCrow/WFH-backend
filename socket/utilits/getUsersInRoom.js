const getUsersInRoom = (room) => {
    return room.users.map(user => {
        const {username, avatar, socketId} = user;
        return {username, avatar, socketId};
    });
};

module.exports = getUsersInRoom;

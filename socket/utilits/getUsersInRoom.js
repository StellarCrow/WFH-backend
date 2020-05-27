const getUsersInRoom = (room) => {
    return room.users.map(user => user.username);
};

module.exports = getUsersInRoom;

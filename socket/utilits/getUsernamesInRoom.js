const getUsernamesInRoom = (room) => {
    return room.users.map(user => user.username);
};

module.exports = getUsernamesInRoom;

const getUsersInRoom = (room) => {
    return room.users.map(item => Object.values(item).pop());
};

module.exports = getUsersInRoom;

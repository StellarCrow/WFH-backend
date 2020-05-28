const getUsersInRoom = (room) => {
    return room.users.map(user => ({username: user.username, avatar: user.avatar}));
};

module.exports = getUsersInRoom;

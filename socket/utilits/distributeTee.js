const distributeTee = (currentRoom, pairs) => {
    const users = currentRoom[0].users.map(user => ({...user, tee: []}));
    let userIndex = 0;
    pairs.forEach(pair => {
        users[userIndex].tee.push(pair);
        userIndex = userIndex < users.length - 1
            ? userIndex + 1
            : 0;
    });
    return users;
};
module.exports = distributeTee;

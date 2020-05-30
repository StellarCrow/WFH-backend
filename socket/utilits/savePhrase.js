const {Room} = require('../schemas/room.schema');

const savePhrase = (phrase, room, userID) => {
    const newPhrase = {phrase, created_by: userID};
    return Room.findOneAndUpdate({name: room}, {
        $push: {
            phrases: newPhrase
        }
    })
};

module.exports = savePhrase;

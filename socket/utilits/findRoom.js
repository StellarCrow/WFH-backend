const {Room} = require('../schemas/room.schema');

const findRoom = async ( room) => {
    try {
        return await Room.find({name: room});
    }catch (error) {
        return null;
    }

};

module.exports = findRoom;

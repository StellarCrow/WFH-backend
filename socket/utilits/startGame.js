const {Room} = require('../schemas/room.schema');

const startGame = async (room) => {
  const update = {isGameStarted: true};
  const updatedRoom = await Room.findOneAndUpdate({name: room}, update, {
    new: true,
  });
  return updatedRoom.isGameStarted;
};

module.exports = startGame;

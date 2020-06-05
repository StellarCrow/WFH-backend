const {Tee} = require('../schemas/tee.schema');

const getRoundWinner = async (room_id) => {
  try {
    const winner = await Tee.findOne({room_id, has_lost: false}).where('votes').ne(null);
    return winner;
  } catch (error) {
    console.log(error.message)
  }
};

module.exports = getRoundWinner;
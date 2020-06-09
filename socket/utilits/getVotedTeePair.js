const {Tee} = require('../schemas/tee.schema');

const getVotedTeePair = async (room_id) => {
  try {
    const votedPair = await Tee.find({room_id, has_lost: false}).where('votes').ne(null).limit(2);
    return votedPair;
  } catch (error) {
    console.log(error.message)
  }
};

module.exports = getVotedTeePair;
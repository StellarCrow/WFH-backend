const {Tee} = require('../schemas/tee.schema');

const getNextTee = async (room_id) => {
  try {
    const nextTee = await Tee.findOne({room_id, has_lost: false, votes: null});
    return nextTee;
  } catch (error) {
    console.log(error.message)
  }
};

module.exports = getNextTee;
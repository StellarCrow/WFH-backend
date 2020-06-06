const {Tee} = require('../schemas/tee.schema');

const voteForTee = async ({room_id, created_by}) => {
  try {
    await Tee.findOneAndUpdate({room_id, created_by}, {$inc: {votes: 1}});
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = voteForTee;
const {Tee} = require('../schemas/tee.schema');

const setupTeePair = async (room_id) => {
  let tees;
  try {
    tees = await Tee.find({room_id, has_lost: false});
    tees[0].votes = 0;
    tees[1].votes = 0;
    await tees[0].save();
    await tees[1].save();
    
    return tees.slice(0, 2);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = setupTeePair;
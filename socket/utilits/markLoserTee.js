const markLoserTee = async (loser) => {
  try {
    loser.has_lost = true;
    await loser.save();
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = markLoserTee;

const resetWinnerTee = async (winner) => {
  try {
    winner.votes = null;
    await winner.save();
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = resetWinnerTee;
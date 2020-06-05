const setupNextTee = async (nextTee) => {
  try {
    nextTee.votes = 0;
    await nextTee.save();
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = setupNextTee;
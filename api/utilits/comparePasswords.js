const bcrypt = require('bcrypt');

const comparePasswords = (inputPassword, comparedPassword) => {
  try {
    return bcrypt.compare(inputPassword, comparedPassword);
  } catch (error) {
    return null;
  }
};
module.exports = comparePasswords;

const jwt = require('jsonwebtoken');
const config = require('config');

const secret = config.get('JWT_SECRET');

const createToken = (userID) => jwt.sign(
  { token: userID },
  process.env.JWT_SECRET || secret,
  { expiresIn: '1d' },
);
module.exports = createToken;

/* eslint-disable import/no-unresolved */
const jwt = require('jsonwebtoken');
const config = require('config');

const { secret } = config.get('JWT_SECRET');
const errorHandler = require('@utilits/errorHandler');
const { JWT_HEADER } = require('@data/requestHeaders');
const { ERROR } = require('@data/logs');

const tokenAuth = (req, res, next) => {
  try {
    const verified = jwt.verify(req.headers[JWT_HEADER], process.env.JWT_SECRET || secret);
    if (verified.exp < Date.now() / 1000) {
      throw new Error(ERROR.JWT_EXPIRED); // throw an error to have a 1 end point in function
    }
  } catch (error) {
    return errorHandler(error.message, res);
  }
  next();
};
module.exports = tokenAuth;

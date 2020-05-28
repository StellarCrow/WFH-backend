const comparePasswords = require('./comparePasswords');
const createToken = require('./createToken');
const createUser = require('./createUser');
const dbConnection = require('./dbConnection');
const errorHandler = require('./errorHandler');
const hashPassword = require('./hashPassword');
const successResponse = require('./successResponse');
const validateUser = require('./validateUser');
const randomAvatar = require('./randomAvatar');

module.exports = {
  comparePasswords,
  createToken,
  createUser,
  dbConnection,
  errorHandler,
  hashPassword,
  successResponse,
  validateUser,
  randomAvatar
};

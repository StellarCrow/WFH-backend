/* eslint-disable import/no-unresolved */
const errorHandler = require('@utilits/errorHandler');
const hashPassword = require('@utilits/hashPassword');
const successResponse = require('@utilits/successResponse');
const validateUser = require('@utilits/validateUser');
const createUser = require('@utilits/createUser');
const { SUCCESS, ERROR } = require('@data/logs');


const registerPostHandler = async (req, res) => {
  const user = validateUser(req.body);
  if (!user) {
    return errorHandler(res, ERROR.REGISTER);
  }

  return hashPassword(user.password)
    .then((hashedPass) => createUser(user, hashedPass))
    .then(() => successResponse(res, SUCCESS.REGISTER))
    .catch((err) => errorHandler(res, err.message));
};

module.exports = registerPostHandler;

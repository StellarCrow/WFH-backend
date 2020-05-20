/* eslint-disable import/no-unresolved */
const { SUCCESS, ERROR } = require('@data/logs');
const {
  errorHandler,
  hashPassword,
  successResponse,
  validateUser,
  createUser,
} = require('@utilits');

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

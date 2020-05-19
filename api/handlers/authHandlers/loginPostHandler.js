/* eslint-disable import/no-unresolved */
const { User } = require('@schemas/user.schema');
const errorHandler = require('@utilits/errorHandler');
const { ERROR } = require('@data/logs');
const comparePasswords = require('@utilits/comparePasswords');
const successResponse = require('@utilits/successResponse');
const { SUCCESS } = require('@data/logs');
const createToken = require('@utilits/createToken');

const loginPostHandler = async (req, res) => {
  const { email, password } = req.body;
  let user;

  try {
    user = await User.findOne({ email });
  } catch (error) {
    return errorHandler(res, error.message);
  }
  if (!user) {
    return errorHandler(res, ERROR.LOGIN);
  }

  const compareResult = await comparePasswords(password, user.password);
  if (!compareResult) {
    return errorHandler(res, ERROR.PASS_COMPARING);
  }
  // eslint-disable-next-line no-underscore-dangle
  return successResponse(res, SUCCESS.LOGIN, createToken(user._id));
};

module.exports = loginPostHandler;

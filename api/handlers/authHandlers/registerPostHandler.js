/* eslint-disable import/no-unresolved */
const awsService = require('../../../aws/awsService');
const {
  pathToDefaultAvatars,
  amazonBucketPath,
} = require('../../../aws/constants');
const {SUCCESS, ERROR} = require('@data/logs');
const {
  errorHandler,
  hashPassword,
  successResponse,
  validateUser,
  createUser,
  randomAvatar,
} = require('@utilits');

const registerPostHandler = async (req, res) => {
  const user = validateUser(req.body);
  if (!user) {
    return errorHandler(res, ERROR.REGISTER);
  }

  try {
    const avatarsList = await awsService.getDefaultAvatarList(
      pathToDefaultAvatars,
    );
    user.avatar = amazonBucketPath + randomAvatar(avatarsList);
  } catch (err) {
    errorHandler(res, err.message);
  }

  return hashPassword(user.password)
    .then((hashedPass) => createUser(user, hashedPass))
    .then(() => successResponse(res, SUCCESS.REGISTER))
    .catch((err) => errorHandler(res, err.message));
};

module.exports = registerPostHandler;

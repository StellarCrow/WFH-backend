/* eslint-disable import/no-unresolved */
const awsService = require('../../../aws/awsService');
const {
    pathToDefaultAvatars,
    amazonBucketPath,
  } = require('../../../aws/constants');
const {User} = require('@schemas/user.schema');
const {ERROR, SUCCESS} = require('@data/logs');
const {
  errorHandler,
  successResponse,
  createToken,
} = require('@utilits');

const googleAuthPostHandler = async (req, res) => {
  const {firstName, lastName, avatar, email} = req.body;
  let user;

  try {
    user = await User.findOne({email});
  } catch (error) {
    return errorHandler(res, error.message);
  }

  if (!avatar) {
    try {
      const avatarsList = await awsService.getDefaultAvatarList(
        pathToDefaultAvatars,
      );
      avatar = amazonBucketPath + randomAvatar(avatarsList);
    } catch (err) {
      errorHandler(res, err.message);
    }
  }

  if (!user) {
    user = await User.create({email, firstName, lastName, avatar});
  }

  // eslint-disable-next-line no-underscore-dangle
  return successResponse(res, SUCCESS.LOGIN, {
    token: createToken(user._id),
    userData: user,
  });
};

module.exports = googleAuthPostHandler;

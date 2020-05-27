const awsService = require('../../../aws/awsService');
const {User} = require('@schemas/user.schema');
const {ERROR, SUCCESS} = require('@data/logs');
const {errorHandler, successResponse} = require('@utilits');

const avatarUploadPostHandler = async (req, res) => {
  const userId = req.params.id;
  let user;

  try {
    user = await User.findById(userId);
  } catch (error) {
    return errorHandler(res, error.message);
  }
  if (!user) {
    return errorHandler(res, ERROR.USER_NOT_EXIST);
  }

  try {
    const imageBuffer = req.file.buffer;
    const path = `users/${userId}/avatar/${userId}.png`;
    const imageData = await awsService.upload(imageBuffer, path);
    const imageLocation = imageData.Location;

    try {
      await User.findOneAndUpdate({_id: userId}, {avatar: imageLocation});
    } catch {
      return errorHandler(res, error.message);
    }

    return successResponse(res, SUCCESS.AVATAR_UPLOAD);
  } catch (err) {
    return errorHandler(res, err.message);
  }
};

module.exports = avatarUploadPostHandler;

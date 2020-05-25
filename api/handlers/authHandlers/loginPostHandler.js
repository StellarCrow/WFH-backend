/* eslint-disable import/no-unresolved */
const {User} = require('@schemas/user.schema');
const {ERROR, SUCCESS} = require('@data/logs');
const {
    errorHandler,
    comparePasswords,
    successResponse,
    createToken,
} = require('@utilits');

const loginPostHandler = async (req, res) => {
    const {email, password} = req.body;
    let user;

    try {
        user = await User.findOne({email});
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
    return successResponse(res, SUCCESS.LOGIN, {token: createToken(user._id), userData: user});
};

module.exports = loginPostHandler;

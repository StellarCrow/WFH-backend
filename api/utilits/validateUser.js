/* eslint-disable import/no-unresolved */
const { userValidator } = require('@schemas/user.schema');

const validateUser = (user) => {
  const { value: validatedUser, error } = userValidator.validate(user);
  if (error) {
    return null;
  }
  return validatedUser;
};
module.exports = validateUser;

/* eslint-disable import/no-unresolved */
const { User } = require('@schemas/user.schema');

const createUser = (user, hashedPass) => new User({ ...user, password: hashedPass }).save();


module.exports = createUser;

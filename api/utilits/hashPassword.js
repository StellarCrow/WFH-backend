const bcrypt = require('bcrypt');
const config = require('config');

const saltsRounds = config.get('SALT_ROUNDS');

const hashPassword = (password) => bcrypt.hash(password, process.env.SALT_ROUNDS || saltsRounds);

module.exports = hashPassword;

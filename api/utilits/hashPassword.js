const bcrypt = require('bcrypt');
const config = require('config');

const saltsRounds = config.get('SALT_ROUNDS');

const hashPassword = (password) => bcrypt.hash(password, saltsRounds);

module.exports = hashPassword;

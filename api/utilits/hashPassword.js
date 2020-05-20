const bcrypt = require('bcrypt');
const config = require('config');

const localeSalts = config.get('SALT_ROUNDS');
const salts = Number(process.env.SALT_ROUNDS || localeSalts);

const hashPassword = (password) => bcrypt.hash(password, salts);

module.exports = hashPassword;

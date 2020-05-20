/* eslint-disable import/no-unresolved */
const mongoose = require('mongoose');
const config = require('config');
const log4js = require('log4js');
const { SUCCESS } = require('@data/logs');

const logger = log4js.getLogger();

const { MONGO_URI } = config.get('DB');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI || MONGO_URI,
      { useNewUrlParser: true, useUnifiedTopology: true });
    logger.info(SUCCESS.DB_CONNECTION);
    return connection;
  } catch (error) {
    logger.error(error.message);
    return null;
  }
};

module.exports = connectDB;

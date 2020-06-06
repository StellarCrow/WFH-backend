const {Tee} = require('../schemas/tee.schema');
const log4js = require('log4js');
const logger = log4js.getLogger();
const {errorHandler} = require('@utilits');

const getTeesByRoom = async (socket, room_id) => {
  logger.info('Looking for tees in room:', room_id);
  let tees;
  try {
    tees = await Tee.find({room_id});
    logger.info('Found tees:', tees.map(tee => tee.created_by));

    return tees;
  } catch (error) {
    return errorHandler(socket, error.message);
  }
};

module.exports = getTeesByRoom;

/* eslint-disable import/no-unresolved */
const log4js = require('log4js');
const { SUCCESS_STATUSES } = require('@data/responseStatuses');
const { SUCCESS } = require('@data/logs');

const logger = log4js.getLogger();

const successResponse = (
  res,
  message = SUCCESS.DEFAULT,
  payload = null,
  status = SUCCESS_STATUSES.DEFAULT,
) => {
  logger.info(message);
  return res.json({
    success: true,
    payload,
    status,
  });
};

module.exports = successResponse;

const log4js = require('log4js');
const logger = log4js.getLogger();
const errorHandler = (socket, answer, payload = null) => {
    logger.error(answer);
    return socket.emit('error-event', {answer, payload});
};
module.exports = errorHandler;

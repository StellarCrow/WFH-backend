errorHandler = (socket, answer, payload = null) => {
    return socket.emit('error-event', {answer, payload});
};
module.exports = errorHandler;

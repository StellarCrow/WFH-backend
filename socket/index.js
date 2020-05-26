const log4js = require('log4js');
const logger = log4js.getLogger();
const {Room} = require('./schemas/room.schema');
const {
    roomsWhereUser,
    errorHandler,
    deleteRoom,
    deleteUserFromRoom,
    addUserToRoom,
    createRoom,
    getUsersInRoom,
    checkForReconnection,
    findRoom
} = require('./utilits');

module.exports = function (socketIO) {
    socketIO.on('connection', function (socket) {
            logger.info('Connected...');


            socket.on('create-room', async ({username, code: room}) => {
                const roomWithUser = await roomsWhereUser(socket.id, username);
                if (roomWithUser.length) {
                    return checkForReconnection(socket, roomWithUser, room);
                }
                const createdRoom = createRoom(socket, room);
                new Room(createdRoom)
                    .save()
                    .catch(error => errorHandler(socket, error.message));
            });

            socket.on('check-room', async (room) => {
                const joinRoom = await findRoom(room);
                if (!joinRoom || !joinRoom.length) {
                    return errorHandler(socket, 'Can not join to room!', room)
                }
                socket.emit('room-available', {answer: 'Join to room is possible', payload: room})
            });

            socket.on('new-user', async ({username, room}) => {
                const roomWithUser = await roomsWhereUser(socket.id, username);
                if (roomWithUser.length) {
                    return checkForReconnection(socket, roomWithUser, room);
                }

                const roomToJoin = await addUserToRoom(socket, room, username);

                if (!roomToJoin) {
                    return errorHandler(socket, "Can not join to room! No such room.", room);
                }

                socket.join(room);
                socketIO
                    .in(room)
                    .emit('new-user-connected', {
                        answer: 'New user connected',
                        payload: getUsersInRoom(roomToJoin),
                    });

            });

            socket.on('new-chat-message', ({message, room, username}) => {
                socket.to(room).broadcast.emit('chat-message', {
                    answer: 'New chat message',
                    payload: {
                        username,
                        message,
                    },
                });
            });
            socket.on('start-game', ({room}) => {
                socketIO.to(room).emit('game-started', {answer: 'Game started', payload: null})
            });

            socket.on('disconnect', async () => {
                logger.info('Disconnecting user...');
                const updatedRoom = await deleteUserFromRoom(socket);
                if (!updatedRoom) {
                    return errorHandler(socket, "Can not delete user from room");
                }

                if (updatedRoom.created_by === socket.id) {
                    return deleteRoom(socket);
                }
                socket.to(updatedRoom.name).broadcast.emit('user-disconnected', {
                    answer: 'User disconnected',
                    payload: {username: updatedRoom.users[socket.id]}
                });

            });

            socket.on('error', () => {
                return errorHandler(socket, "Connection error")
            });

            socket.on('connect_failed', (event) => {
                return errorHandler(socket, "Connection failed!")
            });

            socket.on('media-answer', (answer) => {
                logger.info('Received media answer');
                socket.to(room).broadcast.emit('media-back-answer', {
                    answer: 'Sent media answer back',
                    payload: answer,
                });
            });

            socket.on('media-offer', (offer) => {
                logger.info('Received media offer');
                socket.to(room).broadcast.emit('media-back-offer', {
                    answer: 'Sent media offer back',
                    payload: offer,
                });
            });
        }
    )
};


const log4js = require('log4js');
const logger = log4js.getLogger();
const {Room} = require('./schemas/room.schema');
const {  isUserInRoom, errorHandler, deleteRoom, deleteUserFromRoom, addUserToRoom, createRoom} = require('./utilits');

module.exports = function (socketIO) {
    socketIO.on('connection', function (socket) {
            logger.info('Connected...');

            socket.on('create-room', ({username, code: room}) => {
                logger.info('Creating new room:', room);
                const createdRoom = createRoom(socket, room, username);
                new Room(createdRoom)
                  .save()
                  .then((newRoom) => socket.join(newRoom.name))
                  .catch(error => errorHandler(socket, error.message));
            });

            socket.on('new-user', async ({username, room}) => {
                const connectedRooms = await isUserInRoom(socket.id, username);
                if (connectedRooms.length) {
                    return errorHandler(socket, "Can not join to room!",  room);
                }

                const roomToJoin = await addUserToRoom(socket, room, username);
                if (!roomToJoin) {
                    return errorHandler(socket, "Can not join to room!",  room);
                }

                const totalUsers = roomToJoin.users.map(item => Object.values(item).pop());
                socket.join(roomToJoin.name);

                socketIO
                    .in(roomToJoin.name)
                    .emit('new-user-connected', {
                        answer: 'New user connected',
                        payload: totalUsers,
                    });
            });

            socket.on('new-chat-message', ({message, code: room, username}) => {
                socket.to(room).broadcast.emit('chat-message', {
                    answer: 'New chat message',
                    payload: {
                        username,
                        message,
                    },
                });
            });

            socket.on('disconnect', async () => {
                logger.info('Disconnecting user...');
                const updatedRoom  = await deleteUserFromRoom(socket);

                    if(updatedRoom.created_by === socket.id) {
                      return  deleteRoom(socket);
                    }
                    socket.to(updatedRoom.name).broadcast.emit('user-disconnected', {
                        answer: 'User disconnected',
                        payload: {username: updatedRoom.users[socket.id]}
                    });

            });

            socket.on('error', ()=> {
                return errorHandler(socket, "Connection error")
            });

            socket.on('connect_failed', (event)=> {
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


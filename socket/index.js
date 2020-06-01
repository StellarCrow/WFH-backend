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
    getUserBySocketId,
    checkForReconnection,
    findRoom,
    savePictureLinkInDB,
    savePhrase,
    createPairs
} = require('./utilits');
const {errors, successes} = require('./constants');
const awsService = require('../aws/awsService');

module.exports = function (socketIO) {
    socketIO.on('connection', function (socket) {
            logger.info('Connected...');

            socket.on('create-room', async ({username, code: room}) => {
                // Check if user is already present in any other room
                const roomsWithUser = await roomsWhereUser(socket.id, username);
                if (roomsWithUser.length) {
                    // Check if user is trying to reconnect to same room
                    return checkForReconnection(socket, roomsWithUser.pop(), room);
                }

                const createdRoom = createRoom(socket, room);
                new Room(createdRoom)
                    .save()
                    .catch(error => errorHandler(socket, error.message));
            });

            socket.on('check-room', async (room) => {
                const joinRoom = await findRoom(room);
                if (!joinRoom || !joinRoom.length) {
                    return errorHandler(socket, errors.CANT_JOIN_ROOM, room)
                }
                socket.emit('room-available', {
                    answer: successes.JOIN_ROOM_AVAILABLE,
                    payload: room
                });
            });

            socket.on('new-user', async ({username, room}) => {
                // Check if user is already present in any other room
                const roomsWithUser = await roomsWhereUser(socket.id, username);
                if (roomsWithUser.length) {
                    // Check if user is trying to reconnect to same room
                    return checkForReconnection(socket, roomsWithUser.pop(), room);
                }

                const roomToJoin = await addUserToRoom(socket, room, username);
                if (!roomToJoin) {
                    return errorHandler(socket, errors.NO_SUCH_ROOM, room);
                }

                socket.join(room);
                socketIO
                    .in(room)
                    .emit('new-user-connected', {
                        answer: successes.NEW_USER_CONNECTED,
                        payload: getUsersInRoom(roomToJoin),
                    });
            });

            socket.on('new-chat-message', ({message, room, username}) => {
                socket.to(room).broadcast.emit('chat-message', {
                    answer: successes.NEW_CHAT_MESSAGE,
                    payload: {
                        username,
                        message,
                    },
                });
            });


            socket.on('start-game', ({room}) => {
                socketIO
                    .to(room)
                    .emit('game-started', {answer: successes.GAME_STARTED, payload: null});
            });

            socket.on('user-loaded', ({room, username}) => {
                socketIO
                    .to(room)
                    .emit('new-user-loaded', {answer: successes.USER_LOADED, payload: username});
            });
            socket.on('all-loaded', ({room}) => {
                socketIO
                    .to(room)
                    .emit('all-users-loaded', {answer: successes.ALL_USER_LOADED, payload: null});
            });

            socket.on('save-image', ({canvas, room, pictureNumber}) => {
                awsService
                    .saveCanvasImage(canvas, pictureNumber, socket.id, room)
                    .then(({Location}) => savePictureLinkInDB(Location, room, socket.id))
                    .then(_ => socket.emit('image-saved', {answer: 'Picture saved', payload: null}))
                    .catch((error) => errorHandler(socket, errors.SAVE_IMAGE))
            });
            socket.on('finish-painting', ({username, room}) => {
                socketIO
                    .to(room)
                    .emit('user-finish-painting', {answer: successes.USER_FINISH_PAINTING, payload: username});
            });

            socket.on('all-finish-painting', ({room}) => {
                socketIO
                    .to(room)
                    .emit('stop-painting', {answer: successes.FINISH_PAINTING, payload: null});

            });
            socket.on('new-phrase', ({phrase, room}) => {
                savePhrase(phrase, room, socket.id)
                    .then(_ => {
                        socketIO.to(room)
                            .emit('new-phrase-saved', {answer: successes.SAVE_PHRASE, payload: null});
                    })
                    .catch(error => errorHandler(socket, errors.SAVE_PHRASE))
            });
            socket.on('finish-phrases', ({room, username}) => {
                socketIO.to(room)
                    .emit('user-finish-phrases', {answer: successes.USER_FINISH_PHRASE, payload: username});
            });
            socket.on('all-finish-phrases', ({room}) => {
                socketIO.to(room)
                    .emit('stop-phrases', {answer: successes.ALL_FINISH_PHRASE, payload: null});
            });

            socket.on('start-match', async ({room}) => {
                    const currentRoom = await findRoom(room);
                    if (!currentRoom) {
                        return errorHandler(socket, errors.FIND_ROOM, room)
                    }
                    const pairs = createPairs(currentRoom);
                    const users = currentRoom[0].users.map(user => ({...user, result: []}));


                    (function f(i = 0) {
                        console.log(i)
                        const generatedPair = generator(pairs).next();
                        if (i  === users.length) {
                            console.log('Im on top')
                            return f()
                        }
                        if (!generatedPair.done) {
                            console.log(users[i])
                            users[i].result.push(generatedPair.value);

                            return f(i+1);
                        }
                    })();

                    console.log(users);
                }
            );


            socket.on('disconnect', async () => {
                logger.info('Disconnecting user...');
                const updatedRoom = await deleteUserFromRoom(socket);
                if (!updatedRoom) {
                    return errorHandler(socket, errors.CANT_DELETE_USER_ROOM);
                }

                if (updatedRoom.created_by === socket.id) {
                    return deleteRoom(socket);
                }

                const username = getUserBySocketId(updatedRoom, socket.id).username;
                socket.to(updatedRoom.name).broadcast.emit('user-disconnected', {
                    answer: successes.USER_DISCONNECTED,
                    payload: {username}
                });

            });

            socket.on('error', () => {
                return errorHandler(socket, errors.CONNECTION_ERROR)
            });

            socket.on('connect_failed', (event) => {
                return errorHandler(socket, errors.CONNECTION_FAILED)
            });

            socket.on('media-offer', ({offer, room}) => {
                logger.info('Received media offer');
                socket.to(room).broadcast.emit('media-back-offer', {
                    answer: successes.MEDIA_OFFER,
                    payload: offer,
                });
            });

            socket.on('media-answer', ({answer, room}) => {
                logger.info('Received media answer');
                socket.to(room).broadcast.emit('media-back-answer', {
                    answer: successes.MEDIA_ANSWER,
                    payload: answer,
                });
            });
        }
    )
};

function* generator(array) {
    for (let i = 0; i < array.length; i++) {
        console.log('yielded')
        yield array[i];
    }
}

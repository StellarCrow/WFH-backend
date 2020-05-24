const log4js = require('log4js');
const logger = log4js.getLogger();
const {Room, roomValidation} = require('./schemas/room.schema');

module.exports = function (socketIO) {
    console.log('Handling sockets');

    socketIO.on('connection', function (socket) {
            logger.info('Connected...');
            // TODO: decompose into separate handle,
            // remember to bind socket to the function

            socket.on('create-room', ({username, code: room}) => {
                logger.info('Creating new room:', room);
                const createdRoom = {
                    name: room,
                    users: {
                        [socket.id]: username
                    }
                };
                const {value: validatedRoom, error} = roomValidation.validate(createdRoom);
                if (error) {
                    socket.emit('error-room-creating', {answer: "Room was not validated!", payload: room})
                }

                new Room(validatedRoom)
                  .save()
                  .then((newRoom) =>
                    socket.join(newRoom.name).emit('room-created', {
                        answer: 'New room created',
                        payload: { username },
                    })
                  )
                  .catch((error) => console.log(error));
            });

            socket.on('new-user', async ({username, code: room}) => {
                logger.info('Connecting new user:', username);
                let roomToJoin;

                try {
                     roomToJoin = await Room.findOne({name: room, $where: "Object.keys(this.users).length < 6"});
                }catch(error) {
                    console.log(error)
                }

                if (!roomToJoin) {
                    return socket.emit('error-room-join', {answer: "Can not join to room!", payload: room})
                }

                // emit event back to FE about completion
                socket.join(roomToJoin.name);
                // socket.emit('create-peer');
                socket.to(roomToJoin.name).broadcast.emit('new-user-connected', {
                    answer: 'New user connected',
                    payload: {username},
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

            // TODO: restrict user from being in different rooms at the same time
        //TODO: Add an error handling for failed DB requests
        //TODO: Add an  socket's connection lost handling
            socket.on('disconnect',  () => {
                    const users = {
                        [socket.id]: {$exist: true}
                    };
                    Room.findOneAndUpdate(users, {$unset: `users[${socket.id}]`})
                        .then((room) => {
                                socket.to(room.name).broadcast.emit('user-disconnected', {
                                    answer: 'User disconnected',
                                    payload: {username: room.users[socket.id]}
                                })
                            }
                        )
                        .catch(error => console.log(error));
                }
            );
        }
    )
};

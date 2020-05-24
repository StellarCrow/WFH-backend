const log4js = require('log4js');
const logger = log4js.getLogger();
const {Room, roomValidation} = require('./schemas/room.schema');
const {  isUserInRoom, errorHandler} = require('./utilits');

module.exports = function (socketIO) {
    socketIO.on('connection', function (socket) {
            logger.info('Connected...');

            socket.on('create-room', ({username, code: room}) => {
                logger.info('Creating new room:', room);
                const createdRoom = {
                    name: room,
                    users: [{
                        [socket.id]: username
                    }]
                };
                const {value: validatedRoom, error} = roomValidation.validate(createdRoom);
                if (error) {
                    return errorHandler(socket, "Room was not validated!", room);
                }

                new Room(validatedRoom)
                  .save()
                  .then((newRoom) =>
                    socket.join(newRoom.name).emit('room-created', {
                        answer: 'New room created',
                        payload: { username },
                    })
                  )
                  .catch(error => errorHandler(socket, error.message));
            });

            socket.on('new-user', async ({username, room}) => {
                let roomToJoin;

                const connectedRooms = isUserInRoom(socket.id, username);
                if (connectedRooms.length) {
                    return errorHandler(socket,  "Can not join to room!", room);
                }

                try {
                    roomToJoin = await Room.findOneAndUpdate(
                        {name: room, $where: "this.users.length < 6"},
                        {$push: {users: {[socket.id]: username}}},
                        {new: true});
                } catch (error) {
                    return errorHandler(socket,  error.message, room);
                }

                if (!roomToJoin) {
                    return errorHandler(socket, "Can not join to room!",  room);
                }

                // Max's solution for multiple users in WS room issue
                // const totalUsers = roomToJoin.users.reduce((acc, user) => {
                //     acc.push(Object.values(user));
                //     return acc;
                // },[]);

                // emit event back to FE about completion
                socket.join(roomToJoin.name);
                socket.to(roomToJoin.name).emit('new-user-connected', {
                    answer: 'New user connected',
                    // payload: totalUsers, // Max's solution
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

            socket.on('disconnect', () => {
                    Room.findOneAndUpdate(
                        `this.users.contain(${socket.id})`,
                        {$pull: {users: {$exists: [socket.id]}}})
                        // TODO: add .then block to broadcast user-disconnected event like so ?
                        // .then((room) => {
                        //         socket.to(room.name).broadcast.emit('user-disconnected', {
                        //             answer: 'User disconnected',
                        //             payload: {username: room.users[socket.id]}
                        //         })
                        //     }
                        // )
                        .catch(error => errorHandler(socket, error.message));
                }
            );

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


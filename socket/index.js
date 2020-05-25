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
                  .then((newRoom) => socket.join(newRoom.name))
                  .catch(error => errorHandler(socket, error.message));
            });

            socket.on('new-user', async ({username, room}) => {
                let roomToJoin;

                const connectedRooms = isUserInRoom(socket.id, username);

                try {
                    roomToJoin = await Room.findOneAndUpdate(
                        // TODO: Bug - $where can't be used in basic Mongo Atlas plan
                        // {name: room, $where: "this.users.length < 6"},
                        {name: room},
                        {$push: {users: {[socket.id]: username}}},
                        {new: true});
                } catch (error) {
                    return errorHandler(socket,  error.message, room);
                }

                if (connectedRooms.length || !roomToJoin) {
                    return errorHandler(socket, "Can not join to room!",  room);
                }

                // TODO: Why do we store users as Array of single item Arrays ???
                const totalUsers = roomToJoin.users.reduce((acc, user) => {
                    acc.push(Object.values(user));
                    return acc;
                }, []);

                logger.info(totalUsers);

                // emit event back to FE about completion
                socket
                    .join(roomToJoin.name)
                    .to(roomToJoin.name)
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

            socket.on('disconnect', () => {
                logger.info('Disconnecting user...');
                Room.findOneAndUpdate(
                    `this.users.contain(${socket.id})`,
                    {$pull: {users: {$exists: [socket.id]}}})
                    .then((room) => {
                        socket.to(room.name).broadcast.emit('user-disconnected', {
                            answer: 'User disconnected',
                            payload: {username: room.users[socket.id]}
                        });
                    })
                    .catch(error => errorHandler(socket, error.message));
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


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

                // emit event back to FE about completion
                const totalUsers = roomToJoin.users.reduce((acc, user) => {
                    acc.push(Object.values(user));
                    return acc;
                },[]);

                socket.join(roomToJoin.name);
                socket.to(roomToJoin.name).emit('new-user-connected', {
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
                    Room.findOneAndUpdate(
                        `this.users.contain(${socket.id})`,
                        {$pull: {users: {$exists: [socket.id]}}})
                        .catch(error => errorHandler(socket, error.message));
                }
            );
            socket.on('error', ()=> {
                return errorHandler(socket, "Connection error")
            });
            socket.on('connect_failed', (event)=> {
                return errorHandler(socket, "Connection failed!")
            })
        }
    )
};


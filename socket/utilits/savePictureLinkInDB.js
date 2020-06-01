const {Room} = require('../schemas/room.schema');

const savePictureLinkInDB = (url, room, socketID) => {
    const newPicture = {url, created_by: socketID};
    return Room.findOneAndUpdate({name: room}, {
        $push: {
            pictures: newPicture
        }
    });


};
module.exports = savePictureLinkInDB;

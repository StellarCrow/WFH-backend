const {Room} = require('../schemas/room.schema');

const savePictureLinkInDB = (url, room, socketID, canvasBackground) => {
  const newPicture = {url, created_by: socketID, background: canvasBackground};

  return Room.findOneAndUpdate(
    {name: room},
    {
      $push: {pictures: newPicture},
    },
  );
};
module.exports = savePictureLinkInDB;

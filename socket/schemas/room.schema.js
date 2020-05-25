const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const { Schema } = mongoose;

const Room = new Schema({
    name : { type: String, unique: true },
    users:  Array,
    usersInRoom : Number
});

const roomValidation = Joi.object({
    name: Joi.string().length(4).required(),
    users: Joi.array().items(Joi.object()).min(1).max(6).required(),
    usersInRoom : Joi.number().required()
});


module.exports = { Room : mongoose.model('Room', Room), roomValidation};

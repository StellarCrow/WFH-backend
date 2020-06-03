const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const { Schema } = mongoose;

const Room = new Schema({
    name : { type: String, unique: true },
    users:  Array,
    usersInRoom : Number,
    created_by: { type: String, unique: true },
    pictures : Array,
    phrases : Array,
    isGameStarted: { type: Boolean, default: false }
});

const roomValidation = Joi.object({
    name: Joi.string().length(4).required(),
    users: Joi.array().items(Joi.object()).max(6).required(),
    usersInRoom : Joi.number().required(),
    created_by: Joi.string().required(),
    pictures: Joi.array().items(Joi.object()).max(18).required(),
    phrases: Joi.array().items(Joi.object()).max(18).required()
});


module.exports = { Room : mongoose.model('Room', Room), roomValidation};

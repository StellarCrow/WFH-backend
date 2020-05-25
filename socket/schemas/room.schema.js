const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const { Schema } = mongoose;

const Room = new Schema({
    name : { type: String, unique: true },
    users:  Array,
    usersInRoom : Number,
    created_by: { type: String, unique: true }
});

const roomValidation = Joi.object({
    name: Joi.string().length(4).required(),
    users: Joi.array().items(Joi.object()).max(6).required(),
    usersInRoom : Joi.number().required(),
    created_by: Joi.string().required()
});


module.exports = { Room : mongoose.model('Room', Room), roomValidation};

const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const { Schema } = mongoose;

const Tee = new Schema({
    picture: { type: Object },
    phrase: { type: Object },
    created_by: { type: String },
    room_id: { type: String },
    votes: { type: Number },
    has_lost: { type: Boolean },
});

const teeValidation = Joi.object({
    picture: Joi.object({
        url: Joi.string().required(),
        created_by: Joi.string().required(),
        background: Joi.string().required()
    }),
    phrase: Joi.object({
        phrase: Joi.string().required(),
        created_by: Joi.string().required()
    }),
    created_by: Joi.string().required(),
    room_id: Joi.string().required(),
    votes: Joi.number().default(null),
    has_lost: Joi.boolean().default(false)
});


module.exports = { Tee : mongoose.model('Tee', Tee), teeValidation};

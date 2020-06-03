const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const { Schema } = mongoose;

const Tee = new Schema({
    picture : { type: Object },
    phrase : { type: Object },
    created_by : { type: String },
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
    created_by: Joi.string().required()
});


module.exports = { Tee : mongoose.model('Tee', Tee), teeValidation};

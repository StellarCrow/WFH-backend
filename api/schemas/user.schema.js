const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const { Schema } = mongoose;

const User = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const userValidator = Joi.object({
  email: Joi.string().min(6).max(30).email()
    .required(),
  password: Joi.string().min(7).max(20).required(),
  firstName: Joi.string().min(2).max(20).required(),
  lastName: Joi.string().min(2).max(20).required(),
});

module.exports = { User: mongoose.model('User', User), userValidator };

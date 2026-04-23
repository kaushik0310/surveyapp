const Joi = require("joi");

const responseSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  response: Joi.string().min(5).max(1000).required(),
  rating: Joi.number().min(1).max(5).required()
});

module.exports = {
  responseSchema
};
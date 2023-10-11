import Joi from "joi";

const imgSchema = Joi.object({
  name: Joi.string().required(),
  mimetype: Joi.string().valid('image/jpeg', 'image/png').required(),
  size: Joi.number().max(5000000).required()
}).unknown();

export default imgSchema;
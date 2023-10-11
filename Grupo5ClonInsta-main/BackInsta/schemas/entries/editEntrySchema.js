import Joi from "joi";

const editEntrySchema = Joi.object({
  description: Joi.string().required(),
});

export default editEntrySchema;

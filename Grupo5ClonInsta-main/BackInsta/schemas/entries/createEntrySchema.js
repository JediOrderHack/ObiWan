import Joi from "joi";
import imgSchema from "../imgSchema.js";

const createEntrySchema = Joi.object({
  description: Joi.string().required(),
  photo1: imgSchema.required(),
  photo2: imgSchema.optional(),
  photo3: imgSchema.optional(),
});

export default createEntrySchema;

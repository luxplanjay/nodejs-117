import { Joi, Segments } from "celebrate";
import { isValidObjectId } from "mongoose";

export const createStudentBodySchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(20).required(),
    age: Joi.number().min(15).max(60).required(),
    gender: Joi.string().valid("male", "female", "other").required(),
    avgMark: Joi.number().min(1).max(12).required(),
    onDuty: Joi.boolean(),
  }),
};

const objectIdValidator = (value, helpers) => {
  const isValidId = isValidObjectId(value);
  return !isValidId ? helpers.message("Invalid id format!") : value;
};

export const studentIdParam = {
  [Segments.PARAMS]: Joi.object({
    studentId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const updateStudentSchema = {
  [Segments.PARAMS]: Joi.object({
    studentId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(20),
    age: Joi.number().min(15).max(60),
    gender: Joi.string().valid("male", "female", "other"),
    avgMark: Joi.number().min(1).max(12),
    onDuty: Joi.boolean(),
  }).min(1),
};

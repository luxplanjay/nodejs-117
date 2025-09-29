import { Schema, model } from "mongoose";

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ["male", "female", "other"] },
    avhMark: { type: Number, required: true },
    onDuty: { type: Boolean, reqired: false, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Student = model("Student", studentSchema);

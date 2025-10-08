import mongoose from "mongoose";
import { Student } from "../models/student.js";

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    await mongoose.connect(mongoUrl);
    console.log("✅ Connected to MongoDB");

    await Student.syncIndexes();
  } catch (error) {
    console.log("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

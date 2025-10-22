import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errors } from "celebrate";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { connectMongoDB } from "./db/connectMongoDB.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";
import studentsRoutes from "./routes/studentsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(logger);

app.use(authRoutes);
app.use(studentsRoutes);
app.use(userRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

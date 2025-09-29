import express from "express";
import cors from "cors";
import pino from "pino-http";
import helmet from "helmet";
import "dotenv/config";
import { connectMongoDB } from "./db/connectMongoDB.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import studentsRoutes from "./routes/studentsRoutes.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(pino());

app.use(studentsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

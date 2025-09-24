import express from "express";
import cors from "cors";
import pino from "pino-http";
import helmet from "helmet";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(pino());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  console.log(`Time : ${new Date().toISOString()}`);
  next();
});

app.get("/error", () => {
  throw new Error("This is a forced error.");
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "this is my root route",
  });
});

app.post("/students", (req, res) => {
  console.log(req.body);
  res.status(201).json({ message: "POST request received" });
});

app.get("/students", (req, res) => {
  res.status(200).json([]);
});

app.get("/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  console.log("Student ID:", studentId);
  res.status(200).json({
    message: `Details of student with ID: ${studentId}`,
  });
});

// 404 middleware
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.log("Error Middleware:", err.message);
  res.status(500).json({
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

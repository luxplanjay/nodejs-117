import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.status(200).json({
    message: "this is my root route",
  });
});

app.get("/todos", (req, res) => {
  res.status(200).json(["todo 1", "todo 2", "todo 3"]);
});

app.post("/students", (req, res) => {
  res.status(201).json({ message: "New student" });
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

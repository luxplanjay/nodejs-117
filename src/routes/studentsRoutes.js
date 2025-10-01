import { Router } from "express";
import {
  createStudent,
  getStudentById,
  getStudents,
  deleteStudent,
  updateStudent,
} from "../controllers/studentsController.js";

const router = Router();

router.get("/students", getStudents);
router.get("/students/:studentId", getStudentById);
router.post("/students", createStudent);
router.delete("/students/:studentId", deleteStudent);
router.patch("/students/:studentId", updateStudent);

// PATCH /students/:studentId
// Оновлює ресурс якщо він існує

// PUT /students/:studentId
// Оновлює ресурс якщо він існує
// Створює ресурс якщо він не існує

export default router;

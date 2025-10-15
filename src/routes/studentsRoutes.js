import { Router } from "express";
import { celebrate, Segments } from "celebrate";
import {
  createStudent,
  getStudentById,
  getStudents,
  deleteStudent,
  updateStudent,
} from "../controllers/studentsController.js";
import {
  createStudentBodySchema,
  getStudentsSchema,
  studentIdParam,
  updateStudentSchema,
} from "../validations/studentsValidation.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.use("/students", authenticate);

router.get("/students", celebrate(getStudentsSchema), getStudents);
router.get("/students/:studentId", celebrate(studentIdParam), getStudentById);
router.post("/students", celebrate(createStudentBodySchema), createStudent);
router.delete("/students/:studentId", celebrate(studentIdParam), deleteStudent);
router.patch(
  "/students/:studentId",
  celebrate(updateStudentSchema),
  updateStudent
);

export default router;

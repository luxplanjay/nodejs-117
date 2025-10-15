import { Router } from "express";
import { celebrate } from "celebrate";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validations/authValidation.js";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshSession,
} from "../controllers/authController.js";

const router = Router();

router.post("/auth/register", celebrate(registerUserSchema), registerUser);
router.post("/auth/login", celebrate(loginUserSchema), loginUser);
router.post("/auth/logout", logoutUser);
router.post("/auth/refresh", refreshSession);

export default router;

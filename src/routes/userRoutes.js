import { Router } from "express";
import { updateUserAvatar } from "../controllers/userController.js";
import { upload } from "../middleware/multer.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.patch(
  "/users/me/avatar",
  authenticate,
  upload.single("avatar"),
  updateUserAvatar
);

export default router;

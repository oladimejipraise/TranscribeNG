import { Router } from "express";
import { signup, login, getMe, changePassword } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/login",  login);
router.get("/me", requireAuth, getMe);
router.post("/change-password", requireAuth, changePassword);

export default router;
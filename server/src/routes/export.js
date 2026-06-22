import { Router } from "express";
import { exportTranscript, generateExport } from "../controllers/exportController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/:id",      exportTranscript);
router.post("/generate", generateExport);

export default router;
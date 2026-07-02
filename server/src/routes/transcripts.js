import { Router } from "express";
import { uploadTranscript, getTranscripts, getTranscript, deleteTranscript, updateTranscriptContent } from "../controllers/transcriptController.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.patch("/:id/content", updateTranscriptContent);

router.get("/",        requireAuth, getTranscripts);
router.get("/:id",     requireAuth, getTranscript);
router.post("/upload", requireAuth, upload.single("audio"), uploadTranscript);
router.delete("/:id",  requireAuth, deleteTranscript);

export default router;
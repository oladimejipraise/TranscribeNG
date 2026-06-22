import { Router } from "express";
import { uploadTranscript, getTranscripts, getTranscript, deleteTranscript, updateTranscriptContent } from "../controllers/transcriptController.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.use(requireAuth);

router.get("/",        getTranscripts);
router.get("/:id",     getTranscript);
router.post("/upload", upload.single("audio"), uploadTranscript);
router.delete("/:id",  deleteTranscript);
router.patch("/:id/content", updateTranscriptContent);
export default router;
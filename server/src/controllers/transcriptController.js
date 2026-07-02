import { Transcript } from "../models/Transcript.js";
import { uploadAudio } from "../services/s3.js";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";

export async function uploadTranscript(req, res) {
  try {
    const { language = "auto" } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No audio file provided" });

    // Save audio file locally
    const audioKey = await uploadAudio({
      buffer:   file.buffer,
      mimetype: file.mimetype,
      userId:   req.userId,
    });

    const transcript = await Transcript.create({
      userId:   req.userId,
      title:    file.originalname.replace(/\.[^.]+$/, ""),
      language,
      audioUrl: audioKey,
      duration: "—",
    });

    res.status(201).json(transcript);

    triggerTranscription(transcript.id, audioKey, language);

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
}

async function triggerTranscription(transcriptId, audioKey, language) {
  try {
    console.log(`🎙 Starting transcription for ${transcriptId}...`);

    // Read the file from /tmp
    const filepath = path.join(tmpdir(), audioKey);
    if (!fs.existsSync(filepath)) {
      console.error(`❌ Audio file not found: ${filepath}`);
      return;
    }

    const audioBuffer = fs.readFileSync(filepath);
    const ext         = audioKey.split(".").pop();
    const mimeMap     = { mp3: "audio/mpeg", wav: "audio/wav", m4a: "audio/mp4", ogg: "audio/ogg" };
    const mimetype    = mimeMap[ext] || "audio/mpeg";

    // Send audio as multipart form to Python
    const formData = new FormData();
    formData.append("audio", new Blob([audioBuffer], { type: mimetype }), audioKey);
    formData.append("transcriptId", transcriptId);
    formData.append("language", language);

    const aiRes = await fetch(
      `${process.env.AI_SERVICE_URL}/transcribe/upload?transcriptId=${transcriptId}&audioKey=${audioKey}&language=${language}`,
      { method: "POST", body: formData }
    );

    if (!aiRes.ok) {
      console.error(`❌ Transcription failed for ${transcriptId}: ${aiRes.status}`);
    } else {
      console.log(`✅ Transcription complete for ${transcriptId}`);
      // Clean up temp file after transcription
      fs.unlinkSync(filepath);
    }
  } catch (err) {
    console.error(`❌ Transcription error for ${transcriptId}:`, err.message);
  }
}

export async function getTranscripts(req, res) {
  try {
    const transcripts = await Transcript.findAllByUser(req.userId);
    res.json(transcripts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function getTranscript(req, res) {
  try {
    const transcript = await Transcript.findById(req.params.id, req.userId);
    if (!transcript) return res.status(404).json({ message: "Transcript not found" });
    res.json(transcript);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateTranscriptContent(req, res) {
  try {
    const { content, speakers, status } = req.body;
    const transcript = await Transcript.updateContent(req.params.id, { content, speakers, status });
    res.json(transcript);
  } catch (err) {
    console.error("Update content error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function deleteTranscript(req, res) {
  try {
    const transcript = await Transcript.findById(req.params.id, req.userId);
    if (!transcript) return res.status(404).json({ message: "Transcript not found" });
    await Transcript.delete(req.params.id, req.userId);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
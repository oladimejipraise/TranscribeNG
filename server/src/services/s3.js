import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { tmpdir } from "os";

const EXT_MAP = {
  "audio/mpeg":  "mp3",
  "audio/mp3":   "mp3",
  "audio/wav":   "wav",
  "audio/x-wav": "wav",
  "audio/mp4":   "m4a",
  "audio/x-m4a": "m4a",
  "audio/ogg":   "ogg",
  "audio/webm":  "webm",
};

export async function uploadAudio({ buffer, mimetype, userId }) {
  const ext      = EXT_MAP[mimetype] || "mp3";
  const filename = `${userId}_${randomUUID()}.${ext}`;

  const filepath = path.join(tmpdir(), filename);

  fs.writeFileSync(filepath, buffer);
  console.log(`✅ Audio saved to temp: ${filepath}`);

  return filename;
}

export async function getAudioBuffer(filename) {
  const filepath = path.join(tmpdir(), filename);
  if (!fs.existsSync(filepath)) return null;
  return fs.readFileSync(filepath);
}

export async function getSignedDownloadUrl(key) {
  return `/uploads/${key}`;
}

export async function deleteAudio(key) {
  const filepath = path.join(tmpdir(), key);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    console.log(`🗑 Deleted temp file: ${filepath}`);
  }
}
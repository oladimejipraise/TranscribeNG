import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "../../../uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Map mimetypes to correct extensions
const EXT_MAP = {
  "audio/mpeg":   "mp3",
  "audio/mp3":    "mp3",
  "audio/wav":    "wav",
  "audio/x-wav":  "wav",
  "audio/mp4":    "m4a",
  "audio/x-m4a":  "m4a",
  "audio/ogg":    "ogg",
  "audio/webm":   "webm",
};

export async function uploadAudio({ buffer, mimetype, userId }) {
  const ext      = EXT_MAP[mimetype] || "mp3";
  const filename = `${userId}_${randomUUID()}.${ext}`;
  const filepath = path.join(UPLOADS_DIR, filename);

  fs.writeFileSync(filepath, buffer);
  console.log(`✅ Audio saved locally: ${filepath}`);

  return filename;
}

export async function getSignedDownloadUrl(key) {
  return `/uploads/${key}`;
}

export async function deleteAudio(key) {
  const filepath = path.join(UPLOADS_DIR, key);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
}
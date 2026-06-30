import dotenv from "dotenv";
dotenv.config();

const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export async function transcribeWindow(pcmBuffer, sampleRate, language) {
  const wavBuffer = pcmToWav(pcmBuffer, sampleRate);

  const formData = new FormData();
  formData.append("file", new Blob([wavBuffer], { type: "audio/wav" }), "audio.wav");

  if (language && language !== "auto") {
    formData.append("language", language);
  }

  console.log(`🔗 Calling ${AI_URL}/transcribe — lang: ${language || "auto"}`);

  const res = await fetch(`${AI_URL}/transcribe`, {
    method: "POST",
    body:   formData,
  });

  console.log(`📡 Response status: ${res.status}`);

  if (!res.ok) {
    const errText = await res.text();
    console.error(`❌ Whisper error: ${errText}`);
    return null;
  }

  const data = await res.json();
  console.log(`📝 Whisper result:`, data);
  return data?.text?.trim() || null;
}

function pcmToWav(pcmBuffer, sampleRate) {
  const numChannels   = 1;
  const bitsPerSample = 16;
  const byteRate      = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign    = numChannels * bitsPerSample / 8;
  const dataSize      = pcmBuffer.length;
  const buffer        = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF",               0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE",               8);
  buffer.write("fmt ",              12);
  buffer.writeUInt32LE(16,          16);
  buffer.writeUInt16LE(1,           20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate,  24);
  buffer.writeUInt32LE(byteRate,    28);
  buffer.writeUInt16LE(blockAlign,  32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data",              36);
  buffer.writeUInt32LE(dataSize,    40);
  pcmBuffer.copy(buffer,            44);

  return buffer;
}
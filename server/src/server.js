// import http from "http";
// import { WebSocketServer } from "ws";
// import app from "./app.js";
// import dotenv from "dotenv";

// dotenv.config();

// const PORT   = process.env.PORT || 5000;
// const server = http.createServer(app);
// const wss    = new WebSocketServer({ server, path: "/transcribe/live" });

// wss.on("connection", (ws, req) => {
//   const params   = new URL(req.url, "http://localhost").searchParams;
//   const language = params.get("lang") || "auto";

//   console.log(`🎙 WS connected — lang: ${language}`);

//   let audioBuffer  = [];
//   let bufferSize   = 0;
//   let whisperBusy  = false;
//   const BATCH_SIZE = 100000;

//   async function sendToWhisper(forceFlush = false) {
//     if (audioBuffer.length === 0) return;
//     if (whisperBusy && !forceFlush) {
//       console.log("⏭ Whisper busy — dropping batch");
//       audioBuffer = [];
//       bufferSize  = 0;
//       return;
//     }

//     const combined = Buffer.concat(audioBuffer);
//     audioBuffer    = [];
//     bufferSize     = 0;
//     whisperBusy    = true;

//     console.log(`📤 Sending ${combined.length} bytes to Whisper`);

//     try {
//       const aiRes = await fetch(
//         `${process.env.AI_SERVICE_URL}/transcribe/stream`,
//         {
//           method:  "POST",
//           headers: { "Content-Type": "audio/webm", "x-language": language },
//           body:    combined,
//         }
//       );

//       if (aiRes.ok) {
//         const data = await aiRes.json();
//         if (data.line && data.line.text?.trim()) {
//           if (ws.readyState === ws.OPEN) {
//             ws.send(JSON.stringify({ type: "line", payload: data.line }));
//             console.log(`✅ Sent line: ${data.line.text}`);
//           }
//         } else {
//           console.log("⚠️ Empty transcription");
//         }
//       } else {
//         console.error(`❌ Whisper error: ${aiRes.status}`);
//       }
//     } catch (err) {
//       console.error("Whisper fetch error:", err.message);
//     } finally {
//       whisperBusy = false;
//     }
//   }

//   ws.on("message", async (chunk) => {
//     try {
//       let parsed;
//       try { parsed = JSON.parse(chunk.toString()); } catch {}

//       if (parsed?.type === "end") {
//         console.log("🏁 Client sent end signal — flushing buffer");
//         await sendToWhisper(true);
//         if (ws.readyState === ws.OPEN) {
//           ws.send(JSON.stringify({ type: "done" }));
//         }
//         return;
//       }

//       audioBuffer.push(chunk);
//       bufferSize += chunk.length;

//       if (bufferSize >= BATCH_SIZE) {
//         await sendToWhisper();
//       }

//     } catch (err) {
//       console.error("WS message error:", err.message);
//     }
//   });

//   ws.on("close", () => {
//     console.log("🔌 WS disconnected");
//     audioBuffer = [];
//   });

//   ws.on("error", (err) => console.error("WS error:", err.message));
// });

// server.listen(PORT, () => {
//   console.log(`🚀 TranscribeNG API running on port ${PORT}`);
// });

import http from "http";
import { WebSocketServer } from "ws";
import app from "./app.js";
import { transcribeWindow } from "./whisperClient.js";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer(app);
const wss    = new WebSocketServer({ server, path: "/transcribe/live" });

const WINDOW_MS      = 2500;
const SAMPLE_RATE    = 16000;
const BYTES_PER_SAMPLE = 2;
const WINDOW_BYTES   = (WINDOW_MS / 1000) * SAMPLE_RATE * BYTES_PER_SAMPLE;

wss.on("connection", (ws, req) => {
  const url  = new URL(req.url, "http://x");
  const lang = url.searchParams.get("lang") || "auto";

  console.log(`🎙 WS connected — lang: ${lang}`);

  let buf  = Buffer.alloc(0);
  let busy = false;

  const flush = async () => {
    if (busy || buf.length < WINDOW_BYTES) return;
    busy = true;

    const window = buf.subarray(0, WINDOW_BYTES);
    buf          = buf.subarray(WINDOW_BYTES);

    console.log(`📤 Transcribing ${window.length} bytes (${WINDOW_MS}ms window)`);

    try {
      const text = await transcribeWindow(window, SAMPLE_RATE, lang);
      if (text && ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: "partial", text }));
        console.log(`✅ Partial: ${text}`);
      }
    } catch (e) {
      console.error("Transcribe error:", e.message);
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: "error", message: e.message }));
      }
    } finally {
      busy = false;
      flush(); // process next window immediately
    }
  };

  ws.on("message", async (data, isBinary) => {
    if (isBinary) {
      buf = Buffer.concat([buf, data]);
      flush();
    } else {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === "stop") {
          console.log("🏁 Stop received — flushing tail");
          if (buf.length > 0) {
            const tail = buf;
            buf        = Buffer.alloc(0);
            const text = await transcribeWindow(tail, SAMPLE_RATE, lang);
            if (text && ws.readyState === ws.OPEN) {
              ws.send(JSON.stringify({ type: "final", text }));
              console.log(`✅ Final: ${text}`);
            }
          }
          if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({ type: "done" }));
          }
        }
      } catch (e) {
        console.error("Message parse error:", e.message);
      }
    }
  });

  ws.on("close", () => {
    console.log("🔌 WS disconnected");
    buf = Buffer.alloc(0);
  });

  ws.on("error", (err) => console.error("WS error:", err.message));
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 TranscribeNG API running on port ${process.env.PORT || 5000}`);
});
import http from "http";
import { WebSocketServer } from "ws";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT   = process.env.PORT || 5000;
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: "/transcribe/live" });

wss.on("connection", (ws, req) => {
  const params   = new URL(req.url, "http://localhost").searchParams;
  const language = params.get("lang") || "auto";

  console.log(`🎙 WS connected — lang: ${language}`);

  ws.on("message", async (chunk) => {
    try {
      const aiRes = await fetch(`${process.env.AI_SERVICE_URL}/transcribe/stream`, {
        method:  "POST",
        headers: { "Content-Type": "audio/webm", "x-language": language },
        body:    chunk,
      });

      if (aiRes.ok) {
        const data = await aiRes.json();
        if (data.line) {
          ws.send(JSON.stringify({ type: "line", payload: data.line }));
        }
      }
    } catch (err) {
      console.error("WS chunk error:", err);
    }
  });

  ws.on("close", () => {
    ws.send(JSON.stringify({ type: "done" }));
    console.log("🔌 WS disconnected");
  });

  ws.on("error", (err) => {
    ws.send(JSON.stringify({ type: "error", payload: err.message }));
  });
});

server.listen(PORT, () => {
  console.log(`🚀 TranscribeNG API running on port ${PORT}`);
});
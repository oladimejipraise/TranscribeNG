import { useRef, useState, useCallback } from "react";

const TARGET_SAMPLE_RATE = 16000;

function downsampleTo16k(float32, inputRate) {
  if (inputRate === TARGET_SAMPLE_RATE) return float32;
  const ratio     = inputRate / TARGET_SAMPLE_RATE;
  const outLength = Math.floor(float32.length / ratio);
  const out       = new Float32Array(outLength);
  for (let i = 0; i < outLength; i++) {
    out[i] = float32[Math.floor(i * ratio)];
  }
  return out;
}

function floatToInt16(f32) {
  const i16 = new Int16Array(f32.length);
  for (let i = 0; i < f32.length; i++) {
    const s = Math.max(-1, Math.min(1, f32[i]));
    i16[i]  = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return i16;
}

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:5000";

export function useAudio({ language = "auto", onPartial, onFinal, onError } = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration,    setDuration]    = useState(0);

  const ctxRef      = useRef(null);
  const streamRef   = useRef(null);
  const wsRef       = useRef(null);
  const nodeRef     = useRef(null);
  const srcRef      = useRef(null);
  const intervalRef = useRef(null);

  const start = useCallback(async () => {
    try {
      const stream      = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const token = localStorage.getItem("tng_token");
      const ws    = new WebSocket(`${WS_URL}/transcribe/live?lang=${language}&token=${token}`);
      ws.binaryType   = "arraybuffer";
      wsRef.current   = ws;

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          console.log("📨 WS message:", msg);
          if (msg.type === "partial") onPartial?.(msg.text);
          if (msg.type === "final") {
            onFinal?.(msg.text);
          }
          if (msg.type === "line")  onFinal?.(msg.payload);
          if (msg.type === "error") onError?.(msg.message);
          if (msg.type === "done") {
            // All transcripts received — now safe to close
            console.log("✅ Done — closing WebSocket");
            wsRef.current?.close();
          }
        } catch (e) {
          console.error("WS parse error:", e);
        }
      };

      ws.onerror = () => onError?.("WebSocket error");
      ws.onclose = () => console.log("🔌 WS closed");

      // Wait for WebSocket to open before starting audio
      await new Promise((res, rej) => {
        ws.onopen  = res;
        ws.onclose = () => rej(new Error("WebSocket closed before opening"));
      });

      const ctx      = new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current = ctx;

      const src      = ctx.createMediaStreamSource(stream);
      srcRef.current = src;

      const node      = ctx.createScriptProcessor(4096, 1, 1);
      nodeRef.current = node;

      node.onaudioprocess = (e) => {
        if (ws.readyState !== WebSocket.OPEN) return;
        const input = e.inputBuffer.getChannelData(0);
        const ds    = downsampleTo16k(input, ctx.sampleRate);
        const pcm   = floatToInt16(ds);
        ws.send(pcm.buffer);
      };

      src.connect(node);
      node.connect(ctx.destination);

      setIsRecording(true);
      setDuration(0);

      intervalRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);

    } catch (err) {
      console.error("Microphone error:", err);
      onError?.(err.message || "Microphone access denied");
    }
  }, [language, onPartial, onFinal, onError]);

  const stop = useCallback(() => {
    // Stop recording hardware
    nodeRef.current?.disconnect();
    srcRef.current?.disconnect();

    if (ctxRef.current && ctxRef.current.state !== "closed") {
      ctxRef.current.close();
    }

    streamRef.current?.getTracks().forEach((t) => t.stop());
    clearInterval(intervalRef.current);

    // Send stop signal — keep WS open to receive final transcript
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "stop" }));
      // WS will close itself after receiving "done"
    }

    // Clear audio refs but keep wsRef open
    nodeRef.current   = null;
    srcRef.current    = null;
    ctxRef.current    = null;
    streamRef.current = null;

    setIsRecording(false);
  }, []);

  function formatDuration(secs) {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  return {
    isRecording,
    recording: isRecording,
    duration,
    formattedDuration: formatDuration(duration),
    start,
    stop,
  };
}
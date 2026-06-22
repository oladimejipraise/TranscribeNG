import { useState, useRef, useCallback } from "react";

export function useAudio() {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration]   = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRef    = useRef(null);
  const chunksRef   = useRef([]);
  const intervalRef = useRef(null);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start(250);
      setRecording(true);
      setDuration(0);

      intervalRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  }, []);

  const stop = useCallback(() => {
    mediaRef.current?.stop();
    clearInterval(intervalRef.current);
    setRecording(false);
  }, []);

  function formatDuration(secs) {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  return { recording, duration, audioBlob, formattedDuration: formatDuration(duration), start, stop };
}
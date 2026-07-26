import { useState, useCallback, useEffect, useRef } from "react";
import { useAudio } from "../../hooks/useAudio";
import Sidebar from "../dashboard/Sidebar";
import WaveformBar from "./WaveformBar";
import TranscriptViewer from "./TranscriptViewer";
import AISummary from "./AISummary";
import ExportModal from "../dashboard/ExportModal";
import Button from "../ui/Button";

const LANGUAGES = [
  { label: "Auto Detect", value: "auto" },
  { label: "Yoruba",      value: "yo"   },
  { label: "Hausa",       value: "ha"   },
  { label: "Igbo",        value: "ig"   },
  { label: "English",     value: "en"   },
];

export default function LiveRecording() {
  const [sidebarOpen,     setSidebarOpen]     = useState(false);
  const [lines,           setLines]           = useState([]);
  const [showTranslation, setShowTranslation] = useState(false);
  const [summary,         setSummary]         = useState(null);
  const [language,        setLanguage]        = useState("auto");
  const [partialText,     setPartialText]     = useState("");
  const [totalSeconds,    setTotalSeconds]    = useState(0);
  const [isPaused,        setIsPaused]        = useState(false);
  const [exportOpen,      setExportOpen]      = useState(false);
  const timerRef = useRef(null);
  const mainRef  = useRef(null);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, []);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  function startTimer() {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTotalSeconds((s) => s + 1);
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timerRef.current);
  }

  function formatTime(secs) {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  const handlePartial = useCallback((text) => {
  if (text?.trim()) {
    setLines((prev) => [...prev, {
      id:          Date.now() + Math.random(),
      speaker:     "S1",
      text:        text.trim(),
      translation: null,
      time:        "00:00",
      lang:        "auto",
      confidence:  0.9,
    }]);
  }
  setPartialText("");
  }, []);

  const handleFinal = useCallback((lineOrText) => {
    setPartialText("");
    const line = typeof lineOrText === "string"
      ? { id: Date.now(), speaker: "S1", text: lineOrText, translation: null, time: "00:00", lang: "auto", confidence: 0.9 }
      : lineOrText;
    if (line?.text?.trim()) {
      setLines((prev) => [...prev, { ...line, id: Date.now() + Math.random() }]);
    }
  }, []);

  const handleError = useCallback((err) => {
    console.error("Audio error:", err);
  }, []);

  const { isRecording, start, stop } = useAudio({
    language,
    onPartial: handlePartial,
    onFinal:   handleFinal,
    onError:   handleError,
  });

  function handleRecord() {
    if (isRecording) {
      stop();
      pauseTimer();
      setIsPaused(true);
      setPartialText("");
    } else {
      setIsPaused(false);
      startTimer();
      start();
    }
  }

  function handleReset() {
    const scrollPos = mainRef.current?.scrollTop || 0;
    try { stop(); } catch {}
    clearInterval(timerRef.current);
    setLines([]);
    setSummary(null);
    setPartialText("");
    setTotalSeconds(0);
    setIsPaused(false);
    setExportOpen(false);
    setTimeout(() => {
      if (mainRef.current) mainRef.current.scrollTop = scrollPos;
    }, 0);
  }

  async function generateSummary() {
    if (lines.length === 0) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/summary`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcriptId: "live", lines, language }),
      });
      if (res.ok) {
        const data = await res.json();
        setSummary({ ...data, duration: formatTime(totalSeconds), speakers: 2 });
      }
    } catch (err) {
      console.error("Summary error:", err);
    }
  }

  const buttonLabel = isRecording ? "⏸" : isPaused ? "▶" : "🎙";
  const buttonColor = isRecording
    ? "bg-red-500 hover:bg-red-600 shadow-red-500/25"
    : "bg-forest hover:bg-forest/90 shadow-forest/25";

  return (
    <div className="flex h-screen overflow-hidden bg-dark">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main ref={mainRef} className="flex-1 overflow-y-auto">
        <div className="px-4 md:px-8 py-4 md:py-6 max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden flex flex-col gap-1.5 cursor-pointer p-1"
              >
                <span className="block w-5 h-0.5 bg-cream/70" />
                <span className="block w-5 h-0.5 bg-cream/70" />
                <span className="block w-5 h-0.5 bg-cream/70" />
              </button>
              <div>
                <h1 className="font-syne font-bold text-xl md:text-2xl text-cream">Live Recording</h1>
                <p className="text-sm text-cream/40 mt-0.5 hidden md:block">Transcribe in real time</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white/5 border border-subtle text-cream/70 text-xs rounded-lg px-2 md:px-3 py-2 outline-none focus:border-forest transition-colors cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value} className="bg-dark">{l.label}</option>
                ))}
              </select>
              <button
                onClick={handleReset}
                className="text-xs text-cream/40 hover:text-cream border border-subtle hover:border-white/20 px-2 md:px-3 py-2 rounded-lg transition-all cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Recording panel */}
          <div className="bg-surface border border-subtle rounded-2xl px-4 md:px-7 py-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {isRecording ? (
                  <div className="flex items-center gap-2 text-accent text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Recording
                  </div>
                ) : isPaused ? (
                  <div className="flex items-center gap-2 text-xs font-medium text-yellow-400">
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    Paused
                  </div>
                ) : (
                  <span className="text-xs text-cream/30">Ready</span>
                )}
                <span className="text-xs text-cream/25 tabular-nums">
                  {formatTime(totalSeconds)}
                </span>
              </div>
              {isRecording && (
                <div className="flex items-center gap-1.5 text-2xs text-accent border border-forest/30 bg-forest/10 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Live transcribing
                </div>
              )}
            </div>

            <WaveformBar active={isRecording} />

            {partialText && (
              <p className="text-xs text-cream/30 italic mt-2 px-1">
                Processing: {partialText}
              </p>
            )}

            <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`text-2xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  showTranslation
                    ? "bg-forest/20 text-accent border-forest/30"
                    : "text-cream/40 border-subtle hover:text-cream"
                }`}
              >
                {showTranslation ? "✓ Showing Translation" : "Translate to English"}
              </button>

              <div className="flex items-center gap-3">
                {lines.length > 0 && !isRecording && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => setExportOpen(true)}>
                       Export
                    </Button>
                  </>
                )}
                <button
                  onClick={handleRecord}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl transition-all duration-200 cursor-pointer shadow-lg ${buttonColor}`}
                >
                  {buttonLabel}
                </button>
              </div>
            </div>
          </div>

          {lines.length === 0 && !isRecording && !isPaused && (
            <div className="text-center py-6">
              <p className="text-sm text-cream/25">
                Press the mic button to start recording
              </p>
            </div>
          )}

          <TranscriptViewer
            lines={lines}
            showTranslation={showTranslation}
            isStreaming={isRecording}
          />

          <AISummary summary={summary} onClose={() => setSummary(null)} />

        </div>
      </main>

      {exportOpen && (
        <ExportModal
          transcript={{
            title:   `Live Recording — ${new Date().toLocaleDateString()}`,
            content: lines,
            language,
          }}
          onClose={() => setExportOpen(false)}
        />
      )}
    </div>
  );
}
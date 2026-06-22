import { useState } from "react";
import { useAudio } from "../../hooks/useAudio";
import { useTranscript } from "../../hooks/useTranscript";
import Sidebar from "../dashboard/Sidebar";
import WaveformBar from "./WaveformBar";
import TranscriptViewer from "./TranscriptViewer";
import AISummary from "./AISummary";
import Button from "../ui/Button";

const LANGUAGES = ["Auto Detect", "Yoruba", "Hausa", "Igbo", "English"];

export default function LiveRecording() {
  const { recording, formattedDuration, start, stop } = useAudio();
  const {
    lines, showTranslation, setShowTranslation,
    detectedLang, isStreaming, summary,
    startDemo, generateSummary, reset,
  } = useTranscript();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleRecord() {
    if (recording) {
      stop();
    } else {
      start();
      startDemo();
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-dark">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto">
        <div className="px-4 md:px-8 py-6 md:py-8 max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
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
              <select className="bg-white/5 border border-subtle text-cream/70 text-xs rounded-lg px-2 md:px-3 py-2 outline-none focus:border-forest transition-colors cursor-pointer">
                {LANGUAGES.map((l) => (
                  <option key={l} value={l} className="bg-dark">{l}</option>
                ))}
              </select>
              <button
                onClick={reset}
                className="text-xs text-cream/40 hover:text-cream border border-subtle hover:border-white/20 px-2 md:px-3 py-2 rounded-lg transition-all cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Recording panel */}
          <div className="bg-surface border border-subtle rounded-2xl px-4 md:px-7 py-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {recording ? (
                  <div className="flex items-center gap-2 text-accent text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Recording
                  </div>
                ) : (
                  <span className="text-xs text-cream/30">Ready</span>
                )}
                <span className="text-xs text-cream/25 tabular-nums">{formattedDuration}</span>
              </div>
              {recording && (
                <div className="flex items-center gap-1.5 text-2xs text-accent border border-forest/30 bg-forest/10 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {detectedLang} detected
                </div>
              )}
            </div>

            <WaveformBar active={recording || isStreaming} />

            <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
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
                {lines.length > 0 && !recording && (
                  <Button variant="ghost" size="sm" onClick={generateSummary}>
                    ✨ AI Summary
                  </Button>
                )}
                <button
                  onClick={handleRecord}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl transition-all duration-200 cursor-pointer shadow-lg ${
                    recording
                      ? "bg-red-500 hover:bg-red-600 shadow-red-500/25"
                      : "bg-forest hover:bg-forest/90 shadow-forest/25"
                  }`}
                >
                  {recording ? "⏹" : "🎙"}
                </button>
              </div>
            </div>
          </div>

          {/* Demo button */}
          {lines.length === 0 && !recording && (
            <div className="text-center py-4 mb-4">
              <button
                onClick={startDemo}
                className="text-xs text-cream/40 hover:text-accent border border-subtle hover:border-forest/40 px-4 py-2 rounded-lg transition-all cursor-pointer"
              >
                Load demo transcript
              </button>
            </div>
          )}

          <TranscriptViewer
            lines={lines}
            showTranslation={showTranslation}
            isStreaming={isStreaming || recording}
          />

          <AISummary summary={summary} onClose={() => reset()} />

        </div>
      </main>
    </div>
  );
}
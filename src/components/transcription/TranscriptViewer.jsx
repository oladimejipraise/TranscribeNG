import { useEffect, useRef } from "react";
import SpeakerTag from "./SpeakerTag";

const LANG_BADGE = {
  Yoruba:  "bg-forest/15 text-accent border-forest/25",
  Hausa:   "bg-blue-500/10 text-blue-400 border-blue-400/20",
  Igbo:    "bg-purple-500/10 text-purple-400 border-purple-400/20",
  English: "bg-white/5 text-cream/40 border-white/10",
  Mixed:   "bg-yellow-500/10 text-yellow-400 border-yellow-400/20",
};

export default function TranscriptViewer({ lines, showTranslation, isStreaming }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div className="bg-surface border border-subtle rounded-2xl flex flex-col" style={{ height: "420px" }}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-subtle">
        <p className="text-xs font-medium text-cream/50">Live Transcript</p>
        {isStreaming && (
          <div className="flex items-center gap-1.5 text-accent text-2xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Transcribing...
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {lines.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-cream/25 text-center">
              Press Record to start transcribing<br />or load a demo
            </p>
          </div>
        ) : (
          lines.map((line) => {
            const badgeStyle = LANG_BADGE[line.lang] || LANG_BADGE.English;
            return (
              <div
                key={line.id}
                className="flex gap-3 opacity-0 animate-[fadeUp_0.4s_ease_forwards]"
              >
                <SpeakerTag speaker={line.speaker} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-2xs px-2 py-0.5 rounded border ${badgeStyle}`}>{line.lang}</span>
                    <span className="text-2xs text-cream/25 tabular-nums">{line.time}</span>
                    {line.confidence < 0.95 && (
                      <span className="text-2xs text-yellow-500/60">~{Math.round(line.confidence * 100)}%</span>
                    )}
                  </div>
                  <p className="text-sm text-cream leading-snug">{line.text}</p>
                  {showTranslation && line.translation && (
                    <p className="text-xs text-cream/45 italic mt-1">{line.translation}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
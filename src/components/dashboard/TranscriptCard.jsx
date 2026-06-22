import { useState } from "react";
import { useTranscripts } from "../../context/TranscriptContext";
import ExportModal from "./ExportModal";

const LANG_COLORS = {
  Yoruba:  "bg-forest/20 text-accent border-forest/30",
  Hausa:   "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Igbo:    "bg-purple-500/10 text-purple-400 border-purple-500/20",
  English: "bg-white/5 text-cream/50 border-white/10",
  auto:    "bg-white/5 text-cream/50 border-white/10",
};

export default function TranscriptCard({ transcript }) {
  const { deleteTranscript, setActive } = useTranscripts();
  const { id, title, language, duration, date, speakers, status } = transcript;
  const langStyle = LANG_COLORS[language] || LANG_COLORS.English;
  const [showExport, setShowExport] = useState(false);

  const isProcessing = status === "processing";

  return (
    <>
      <div
        onClick={() => !isProcessing && setActive(transcript)}
        className={`flex items-center justify-between px-5 py-4 bg-surface border border-subtle rounded-xl transition-all duration-150 group ${
          isProcessing
            ? "opacity-70 cursor-not-allowed"
            : "hover:bg-white/5 hover:border-white/15 cursor-pointer"
        }`}
      >
        <div className="flex items-center gap-4 min-w-0">

          {/* Icon — pulse animation when processing */}
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-accent flex-shrink-0 ${
            isProcessing ? "bg-forest/10" : "bg-forest/15"
          }`}>
            {isProcessing ? (
              <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            ) : (
              "🎙"
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-cream truncate">{title}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-2xs px-2 py-0.5 rounded border ${langStyle}`}>
                {language}
              </span>
              <span className="text-2xs text-cream/30">{date}</span>
              <span className="text-2xs text-cream/30">·</span>
              <span className="text-2xs text-cream/30">{duration}</span>
              {!isProcessing && (
                <>
                  <span className="text-2xs text-cream/30">·</span>
                  <span className="text-2xs text-cream/30">{speakers} speakers</span>
                </>
              )}

              {/* Transcribing status badge */}
              {isProcessing && (
                <span className="text-2xs text-accent bg-forest/10 border border-forest/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Transcribing...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons — only show when done */}
        {!isProcessing && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0 ml-4">
            <button
              onClick={(e) => { e.stopPropagation(); setShowExport(true); }}
              className="text-2xs text-cream/40 hover:text-accent px-2.5 py-1.5 rounded-lg hover:bg-forest/10 transition-all cursor-pointer"
            >
              Export
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); deleteTranscript(id); }}
              className="text-2xs text-cream/40 hover:text-red-400 px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {showExport && (
        <ExportModal
          transcript={transcript}
          onClose={() => setShowExport(false)}
        />
      )}
    </>
  );
}
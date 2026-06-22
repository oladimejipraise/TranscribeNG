export default function AISummary({ summary, onClose }) {
  if (!summary) return null;

  const sentimentColor = {
    Positive: "text-accent bg-forest/15 border-forest/30",
    Neutral:  "text-cream/60 bg-white/5 border-white/10",
    Negative: "text-red-400 bg-red-500/10 border-red-500/20",
  }[summary.sentiment] || "text-cream/60 bg-white/5 border-white/10";

  return (
    <div className="bg-surface border border-subtle rounded-2xl p-6 mt-4">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-lg">✨</span>
          <h3 className="font-syne font-semibold text-base text-cream">AI Summary</h3>
        </div>
        <button onClick={onClose} className="text-cream/30 hover:text-cream text-sm transition-colors cursor-pointer">✕</button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white/5 rounded-xl px-4 py-3 text-center">
          <p className="text-2xs text-cream/40 mb-1">Duration</p>
          <p className="font-syne font-bold text-lg text-cream">{summary.duration}</p>
        </div>
        <div className="bg-white/5 rounded-xl px-4 py-3 text-center">
          <p className="text-2xs text-cream/40 mb-1">Speakers</p>
          <p className="font-syne font-bold text-lg text-cream">{summary.speakers}</p>
        </div>
        <div className="bg-white/5 rounded-xl px-4 py-3 text-center">
          <p className="text-2xs text-cream/40 mb-1">Sentiment</p>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${sentimentColor}`}>
            {summary.sentiment}
          </span>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-2xs text-cream/40 uppercase tracking-widest mb-3">Key Points</p>
        <ul className="flex flex-col gap-2">
          {summary.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-cream/70">
              <span className="text-accent mt-0.5 flex-shrink-0">✓</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-2xs text-cream/40 uppercase tracking-widest mb-3">Action Items</p>
        <ul className="flex flex-col gap-2">
          {summary.actionItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-cream/70">
              <span className="text-cream/30 mt-0.5 flex-shrink-0">→</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2 mt-6">
        <button className="flex-1 text-xs text-cream/60 hover:text-cream bg-white/5 hover:bg-white/10 border border-subtle rounded-lg py-2.5 transition-all cursor-pointer">
          Export Summary
        </button>
        <button className="flex-1 text-xs text-cream/60 hover:text-cream bg-white/5 hover:bg-white/10 border border-subtle rounded-lg py-2.5 transition-all cursor-pointer">
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
}
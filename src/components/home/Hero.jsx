import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const HEIGHTS = [
  8,14,22,32,44,38,28,18,12,8,10,16,26,40,52,44,34,22,14,8,
  12,20,32,48,56,46,36,24,16,10,8,14,24,38,50,42,32,20,12,8,
  10,18,28,44,54,46,36,26,18,12,8,14,22,36,48,40,30,20,14,10,
  8,16,26,42,52,44,34,22,14,8,
];

function Waveform() {
  return (
    <div className="bg-surface border border-subtle rounded-2xl px-4 md:px-7 py-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-accent text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Live — Interview – Ibadan Market
        </div>
        <span className="text-xs text-cream/40 tabular-nums">00:03:45</span>
      </div>

      <div className="flex gap-[3px] items-center h-14 mb-4 overflow-hidden">
        {HEIGHTS.map((h, i) => (
          <div
            key={i}
            className={`w-[3px] rounded-sm flex-shrink-0 ${i < 30 ? "bg-forest/30" : "bg-forest"}`}
            style={{
              height: i < 30 ? `${Math.round(h * 0.3)}px` : `${h}px`,
              animation: i >= 30 ? `wave 1.2s ease-in-out ${(i * 0.04).toFixed(2)}s infinite` : "none",
            }}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <span className="text-2xs font-medium px-2.5 py-1 rounded bg-forest/20 text-accent border border-forest/30">Yoruba 85%</span>
        <span className="text-2xs font-medium px-2.5 py-1 rounded bg-white/5 text-cream/50 border border-white/10">English 15%</span>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { height: 6px; }
          50% { height: var(--h); }
        }
      `}</style>
    </div>
  );
}

const LINES = [
  { speaker: "S1", original: "Ẹ káàrọ̀ sir, mo dúpẹ́ pẹ̀ ẹ wá bá mi sọ ọ̀rọ̀ níi.", translation: "Good morning sir, thank you for coming to speak with me today.", time: "00:00:03" },
  { speaker: "S2", original: "Yes, good morning. Ko si wahala, I'm happy to talk to you.", translation: "Yes, good morning. No problem, I'm happy to talk to you.", time: "00:00:07" },
  { speaker: "S1", original: "Ìbérè, sẹ́ ò lẹ̀ sọ fún mi nípa iṣẹ́ tí o ṣe?", translation: "To start with, can you tell me about the work you do?", time: "00:00:12" },
];

function TranscriptDemo() {
  return (
    <div className="bg-surface border border-subtle rounded-2xl px-4 md:px-6 py-5">
      {LINES.map((line, i) => (
        <div
          key={i}
          className="flex gap-3 mb-4 last:mb-0 opacity-0"
          style={{ animation: `fadeUp 0.5s ease ${0.2 + i * 0.6}s forwards` }}
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${line.speaker === "S1" ? "bg-forest/25 text-accent" : "bg-white/10 text-cream/60"}`}>
            {line.speaker}
          </div>
          <div>
            <p className="text-sm text-cream leading-snug mb-0.5">{line.original}</p>
            <p className="text-xs text-cream/45 italic">{line.translation}</p>
            <p className="text-2xs text-cream/30 tabular-nums mt-0.5">{line.time}</p>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function Hero() {
  const { user } = useAuth();
  const destination = user ? "/dashboard" : "/signup";

  return (
    <section className="max-w-[1100px] mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-4 md:pb-8">
      <div className="inline-flex items-center gap-2 bg-forest/15 border border-forest/40 text-accent text-xs font-medium px-3.5 py-1.5 rounded-full mb-8">
        🇳🇬 Built for Nigeria. Powered by AI.
      </div>

      <h1 className="font-syne font-extrabold text-[40px] md:text-[68px] leading-none tracking-tight text-cream max-w-[780px] mb-6">
        Real-time transcription<br />
        for <span className="text-accent">Nigerian languages.</span>
      </h1>

      <p className="text-base md:text-lg text-cream/60 max-w-[480px] leading-relaxed mb-10 font-light">
        Upload audio in Yoruba, Hausa or Igbo and get accurate transcripts,
        translations and smart summaries instantly.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-12">
        <Link to={destination}>
          <Button variant="primary" size="lg">▶ Start Free Trial</Button>
        </Link>
        <Link to={destination}>
          <Button variant="ghost" size="lg">↑ Upload Audio</Button>
        </Link>
      </div>

      <Waveform />
      <TranscriptDemo />

      <p className="text-2xs text-cream/30 text-center mt-4">
        Supports Yoruba &nbsp;·&nbsp; Hausa &nbsp;·&nbsp; Igbo &nbsp;·&nbsp; English &nbsp;·&nbsp; Code-switching
      </p>
    </section>
  );
}
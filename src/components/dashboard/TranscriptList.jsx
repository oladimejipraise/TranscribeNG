import { useState } from "react";
import { useTranscripts } from "../../context/TranscriptContext";
import TranscriptCard from "./TranscriptCard";

const FILTERS = ["All", "Yoruba", "Hausa", "Igbo", "English"];

export default function TranscriptList() {
  const { transcripts } = useTranscripts();
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("All");

  const filtered = transcripts.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || t.language === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="bg-surface border border-subtle rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-syne font-semibold text-base text-cream">My Transcripts</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search transcripts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-subtle text-cream text-xs placeholder:text-cream/25 rounded-lg px-3 py-2 outline-none focus:border-forest transition-colors w-44"
          />
          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-2xs px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filter === f
                    ? "bg-forest/20 text-accent"
                    : "text-cream/40 hover:text-cream hover:bg-white/5"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length > 0 ? (
          filtered.map((t) => <TranscriptCard key={t.id} transcript={t} />)
        ) : (
          <div className="text-center py-12">
            <div className="text-3xl mb-3">🔍</div>
            <p className="text-sm text-cream/40">No transcripts found</p>
          </div>
        )}
      </div>
    </div>
  );
}
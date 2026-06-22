import { useState } from "react";
import { useTranscripts } from "../../context/TranscriptContext";
import Sidebar from "./Sidebar";
import TranscriptCard from "./TranscriptCard";

const FILTERS = ["All", "Yoruba", "Hausa", "Igbo", "English"];

export default function MyTranscripts() {
  const { transcripts, loading }  = useTranscripts();
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = transcripts.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || t.language === filter;
    return matchSearch && matchFilter;
  });

  const grouped = filtered.reduce((acc, t) => {
    const date = t.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {});

  return (
    <div className="flex h-screen overflow-hidden bg-dark">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto">
        <div className="px-4 md:px-8 py-6 md:py-8 max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
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
                <h1 className="font-syne font-bold text-xl md:text-2xl text-cream">My Transcripts</h1>
                <p className="text-sm text-cream/40 mt-0.5 hidden md:block">
                  {transcripts.length} transcript{transcripts.length !== 1 ? "s" : ""} total
                </p>
              </div>
            </div>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 flex-wrap">
            <input
              type="text"
              placeholder="Search transcripts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-subtle text-cream text-sm placeholder:text-cream/25 rounded-lg px-4 py-2.5 outline-none focus:border-forest transition-colors w-full sm:w-64"
            />
            <div className="flex gap-1 flex-wrap">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-2 rounded-lg transition-all cursor-pointer ${
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

          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-2 text-cream/30 text-sm py-12 justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
              Loading transcripts...
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-cream/40 text-sm">
                {search || filter !== "All"
                  ? "No transcripts match your search"
                  : "No transcripts yet — upload an audio file to get started"}
              </p>
            </div>
          )}

          {/* Grouped by date */}
          {!loading && Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <p className="text-2xs text-cream/30 uppercase tracking-widest font-medium">{date}</p>
                <div className="flex-1 border-t border-subtle" />
                <span className="text-2xs text-cream/20">{items.length} item{items.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex flex-col gap-2">
                {items.map((t) => (
                  <TranscriptCard key={t.id} transcript={t} showWorkspaceBadge />
                ))}
              </div>
            </div>
          ))}

        </div>
      </main>
    </div>
  );
}
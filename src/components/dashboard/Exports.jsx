import { useState } from "react";
import { useTranscripts } from "../../context/TranscriptContext";
import Sidebar from "./Sidebar";
import ExportModal from "./ExportModal";

export default function Exports() {
  const { transcripts, loading }      = useTranscripts();
  const [selected, setSelected]       = useState(null);
  const [search, setSearch]           = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const done = transcripts.filter((t) =>
    t.status === "done" &&
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-dark">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto">
        <div className="px-4 md:px-8 py-6 md:py-8 max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex flex-col gap-1.5 cursor-pointer p-1"
            >
              <span className="block w-5 h-0.5 bg-cream/70" />
              <span className="block w-5 h-0.5 bg-cream/70" />
              <span className="block w-5 h-0.5 bg-cream/70" />
            </button>
            <div>
              <h1 className="font-syne font-bold text-xl md:text-2xl text-cream">Exports</h1>
              <p className="text-sm text-cream/40 mt-0.5 hidden md:block">
                Download your completed transcripts in any format
              </p>
            </div>
          </div>

          {/* Format guide */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { icon: "📝", label: "Word (.docx)",      desc: "Best for editing and sharing"        },
              { icon: "📕", label: "PDF (.pdf)",        desc: "Best for printing and archiving"     },
              { icon: "📄", label: "Text (.txt)",       desc: "Plain text, universally compatible"  },
              { icon: "🎬", label: "Subtitles (.srt)",  desc: "For video captioning"                },
            ].map((f) => (
              <div key={f.label} className="bg-surface border border-subtle rounded-xl p-4">
                <div className="text-2xl mb-2">{f.icon}</div>
                <p className="text-xs font-medium text-cream mb-1">{f.label}</p>
                <p className="text-2xs text-cream/35 hidden md:block">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="mb-5">
            <input
              type="text"
              placeholder="Search transcripts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-subtle text-cream text-sm placeholder:text-cream/25 rounded-lg px-4 py-2.5 outline-none focus:border-forest transition-colors w-full sm:w-64"
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-2 text-cream/30 text-sm py-12 justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
              Loading...
            </div>
          )}

          {/* Empty state */}
          {!loading && done.length === 0 && (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">↓</div>
              <p className="text-cream/40 text-sm">
                {search ? "No transcripts match your search" : "No completed transcripts yet"}
              </p>
            </div>
          )}

          {/* Transcript list */}
          <div className="flex flex-col gap-2">
            {done.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between px-4 md:px-5 py-4 bg-surface border border-subtle rounded-xl hover:bg-white/5 transition-all duration-150"
              >
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-forest/15 flex items-center justify-center text-accent flex-shrink-0">
                    🎙
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-cream truncate">{t.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-2xs text-cream/30">{t.date}</span>
                      <span className="text-2xs text-cream/30 hidden md:inline">· {t.duration}</span>
                      <span className="text-2xs text-cream/30 hidden md:inline">· {t.language}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(t)}
                  className="flex items-center gap-2 text-xs font-medium text-accent bg-forest/15 hover:bg-forest/25 border border-forest/30 px-3 md:px-4 py-2 rounded-lg transition-all cursor-pointer flex-shrink-0 ml-3"
                >
                  ↓ Export
                </button>
              </div>
            ))}
          </div>

        </div>
      </main>

      {selected && (
        <ExportModal transcript={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
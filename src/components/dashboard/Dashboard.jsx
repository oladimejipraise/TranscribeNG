import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranscripts } from "../../context/TranscriptContext";
import Sidebar from "./Sidebar";
import UploadBox from "./UploadBox";
import TranscriptList from "./TranscriptList";
import Button from "../ui/Button";

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-surface border border-subtle rounded-xl px-3 py-3 md:px-5 md:py-4 flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-4">
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-forest/15 flex items-center justify-center text-base md:text-xl flex-shrink-0">
        {icon}
      </div>
      <div className="text-center md:text-left">
        <p className="text-2xs text-cream/40 mb-0.5">{label}</p>
        <p className="font-syne font-bold text-lg md:text-xl text-cream">{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { transcripts, loading, error, addTranscript } = useTranscripts();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalMinutes = transcripts.reduce((acc, t) => {
    const parts = t.duration?.split(":").map(Number);
    return acc + (parts && !isNaN(parts[0]) ? parts[0] : 0);
  }, 0);

  const languages = [...new Set(transcripts.map((t) => t.language))].length;

  return (
    <div className="flex h-screen overflow-hidden bg-dark">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto">
        <div className="px-4 md:px-8 py-6 md:py-8 max-w-5xl mx-auto">

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden flex flex-col gap-1.5 cursor-pointer p-1"
              >
                <span className="block w-5 h-0.5 bg-cream/70" />
                <span className="block w-5 h-0.5 bg-cream/70" />
                <span className="block w-5 h-0.5 bg-cream/70" />
              </button>
              <div>
                <h1 className="font-syne font-bold text-xl md:text-2xl text-cream">Dashboard</h1>
                <p className="text-sm text-cream/40 mt-0.5 hidden md:block">Welcome back</p>
              </div>
            </div>
            <Link to="/dashboard/record">
              <Button variant="primary" size="sm">🎙 New Recording</Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
            <StatCard icon="📄" label="Transcripts"        value={loading ? "—" : transcripts.length} />
            <StatCard icon="⏱" label="Minutes"            value={loading ? "—" : `${totalMinutes}`} />
            <StatCard icon="🌐" label="Languages"          value={loading ? "—" : languages || "—"} />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            <UploadBox onUpload={addTranscript} />
            <TranscriptList />
          </div>

        </div>
      </main>
    </div>
  );
}
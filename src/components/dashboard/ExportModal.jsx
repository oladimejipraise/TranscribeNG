import { useState } from "react";

const FORMATS = [
  { value: "docx", label: "Word",      ext: ".docx", icon: "📝" },
  { value: "pdf",  label: "PDF",       ext: ".pdf",  icon: "📕" },
  { value: "txt",  label: "Text",      ext: ".txt",  icon: "📄" },
  { value: "srt",  label: "Subtitles", ext: ".srt",  icon: "🎬" },
];

const CONTENT_TYPES = [
  { value: "both",        label: "Transcript + Translation"  },
  { value: "transcript",  label: "Transcript only"            },
  { value: "translation", label: "Translation only (English)" },
];

const FONTS = ["Gill Sans", "Calibri", "Arial", "Times New Roman", "Georgia"];
const SIZES = [10, 11, 12, 14];

export default function ExportModal({ transcript, onClose }) {
  const [format,            setFormat]            = useState("docx");
  const [contentType,       setContentType]       = useState("both");
  const [fontName,          setFontName]          = useState("Gill Sans");
  const [fontSize,          setFontSize]          = useState(12);
  const [includeSpeakers,   setIncludeSpeakers]   = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [loading,           setLoading]           = useState(false);
  const [error,             setError]             = useState("");

  async function handleExport() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("tng_token");
      const res = await fetch("http://localhost:5000/api/export/generate", {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          lines:              transcript.content || [],
          title:              transcript.title,
          format,
          content_type:       contentType,
          font_name:          fontName,
          font_size:          fontSize,
          include_speakers:   includeSpeakers,
          include_timestamps: includeTimestamps,
          language:           transcript.language || "auto",
        }),
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${transcript.title}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      onClose();
    } catch (err) {
      setError(err.message || "Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-[#0f0f0f] border border-white/8 rounded-2xl w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
          <div>
            <h2 className="font-syne font-semibold text-sm text-white">Export Transcript</h2>
            <p className="text-2xs text-white/35 mt-0.5 truncate max-w-[280px]">{transcript.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">

          {/* Format */}
          <div>
            <p className="text-2xs text-white/30 uppercase tracking-widest mb-2">Format</p>
            <div className="grid grid-cols-4 gap-1.5">
              {FORMATS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    format === f.value
                      ? "border-forest bg-forest/20 text-accent"
                      : "border-white/8 text-white/30 hover:border-white/20 hover:text-white/70"
                  }`}
                >
                  <span className="text-sm">{f.icon}</span>
                  <span>{f.label}</span>
                  <span className="text-2xs opacity-40">{f.ext}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content type */}
          <div>
            <p className="text-2xs text-white/30 uppercase tracking-widest mb-2">Content</p>
            <div className="flex flex-col gap-1">
              {CONTENT_TYPES.map((ct) => (
                <button
                  key={ct.value}
                  onClick={() => setContentType(ct.value)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs transition-all cursor-pointer text-left ${
                    contentType === ct.value
                      ? "border-white/15 bg-white/6 text-white"
                      : "border-white/5 text-white/35 hover:border-white/10 hover:text-white/60"
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                    contentType === ct.value ? "border-white/60 bg-white/20" : "border-white/15"
                  }`}>
                    {contentType === ct.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font & Size + Include — single row */}
          {["docx", "pdf"].includes(format) && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-2xs text-white/30 uppercase tracking-widest mb-2">Font</p>
                <select
                  value={fontName}
                  onChange={(e) => setFontName(e.target.value)}
                  style={{ backgroundColor: "#1a1a1a", color: "#e8ede6" }}
                  className="w-full border border-white/10 text-xs rounded-lg px-2.5 py-2 outline-none focus:border-white/25 transition-colors cursor-pointer"
                >
                  {FONTS.map((f) => (
                    <option key={f} value={f} style={{ backgroundColor: "#1a1a1a", color: "#e8ede6" }}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-2xs text-white/30 uppercase tracking-widest mb-2">Size</p>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  style={{ backgroundColor: "#1a1a1a", color: "#e8ede6" }}
                  className="w-full border border-white/10 text-xs rounded-lg px-2.5 py-2 outline-none focus:border-white/25 transition-colors cursor-pointer"
                >
                  {SIZES.map((s) => (
                    <option key={s} value={s} style={{ backgroundColor: "#1a1a1a", color: "#e8ede6" }}>{s}pt</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Include */}
          <div className="flex items-center gap-5">
            <p className="text-2xs text-white/30 uppercase tracking-widest">Include:</p>
            {[
              { label: "Speaker labels", value: includeSpeakers,   set: setIncludeSpeakers   },
              { label: "Timestamps",     value: includeTimestamps, set: setIncludeTimestamps },
            ].map((opt) => (
              <label key={opt.label} className="flex items-center gap-1.5 cursor-pointer group">
                <div
                  onClick={() => opt.set(!opt.value)}
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                    opt.value ? "bg-forest/30 border-forest" : "border-white/15"
                  }`}
                >
                  {opt.value && <span className="text-accent" style={{ fontSize: "9px" }}>✓</span>}
                </div>
                <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors select-none">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>

          {error && (
            <p className="text-2xs text-red-400/80 bg-red-500/8 border border-red-500/15 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 pb-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 text-xs transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={loading}
            className="flex-1 py-2 rounded-xl bg-forest hover:bg-forest/80 text-white font-medium text-xs transition-all cursor-pointer disabled:opacity-40"
          >
            {loading ? "Generating..." : `Download ${format.toUpperCase()}`}
          </button>
        </div>

      </div>
    </div>
  );
}
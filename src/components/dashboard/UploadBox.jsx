import { useState, useRef } from "react";
import Button from "../ui/Button";

const LANGUAGES = ["Auto Detect", "Yoruba", "Hausa", "Igbo", "English"];
const FORMATS   = ["MP3", "WAV", "M4A", "WhatsApp Voice Note"];

export default function UploadBox({ onUpload }) {
  const [dragging, setDragging] = useState(false);
  const [file,     setFile]     = useState(null);
  const [language, setLanguage] = useState("Auto Detect");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const inputRef = useRef(null);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }

  function handleFile(e) {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  }

  async function handleSubmit() {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("audio",    file);
      formData.append("language", language === "Auto Detect" ? "auto" : language.toLowerCase());

      await onUpload(formData);
      setFile(null);
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface border border-subtle rounded-2xl p-6">
      <h2 className="font-syne font-semibold text-base text-cream mb-4">Upload Audio</h2>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl px-6 py-10 text-center cursor-pointer transition-all duration-200 ${
          dragging
            ? "border-forest bg-forest/10"
            : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".mp3,.wav,.m4a,.ogg,.webm"
          className="hidden"
          onChange={handleFile}
        />
        <div className="text-3xl mb-3">{file ? "🎵" : "☁️"}</div>
        {file ? (
          <p className="text-sm text-accent font-medium">{file.name}</p>
        ) : (
          <>
            <p className="text-sm text-cream/60 mb-1">Drag and drop your audio file here</p>
            <p className="text-2xs text-cream/30">or click to browse</p>
          </>
        )}
        <div className="flex gap-2 justify-center mt-4 flex-wrap">
          {FORMATS.map((f) => (
            <span key={f} className="text-2xs text-cream/30 bg-white/5 px-2 py-0.5 rounded">{f}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-xs text-cream/50">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/5 border border-subtle text-cream text-sm rounded-lg px-3 py-2.5 outline-none focus:border-forest transition-colors cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l} className="bg-dark">{l}</option>
            ))}
          </select>
        </div>

        <Button
          variant="primary"
          size="md"
          className="mt-5"
          onClick={handleSubmit}
          disabled={!file || loading}
        >
          {loading ? "Uploading..." : "Transcribe"}
        </Button>
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-3">
          {error}
        </p>
      )}
    </div>
  );
}
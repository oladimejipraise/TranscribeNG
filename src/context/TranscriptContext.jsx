import { createContext, useContext, useState, useEffect } from "react";

const TranscriptContext = createContext(null);

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function TranscriptProvider({ children }) {
  const [transcripts, setTranscripts] = useState([]);
  const [active,      setActive]      = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");

  // Fetch transcripts on first load
  useEffect(() => {
    fetchTranscripts();
  }, []);

  // Poll every 5 seconds if any transcripts are still processing
  useEffect(() => {
    const hasProcessing = transcripts.some((t) => t.status === "processing");
    if (!hasProcessing) return;

    const interval = setInterval(() => {
      fetchTranscripts();
    }, 5000);

    return () => clearInterval(interval);
  }, [transcripts]);

  async function fetchTranscripts() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("tng_token");
      if (!token) { setLoading(false); return; }

      const res = await fetch(`${BASE_URL}/transcripts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch transcripts");

      const data = await res.json();
      setTranscripts(data.map((t) => ({
        id:       t.id,
        title:    t.title,
        language: t.language,
        duration: t.duration || "—",
        date:     new Date(t.created_at).toLocaleDateString("en-NG", {
          month: "short", day: "numeric", year: "numeric"
        }),
        status:   t.status,
        speakers: t.speakers || 1,
        content:  t.content || [],
      })));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addTranscript(formData) {
    try {
      const token = localStorage.getItem("tng_token");
      const res   = await fetch(`${BASE_URL}/transcripts/upload`, {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}` },
        body:    formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const newTranscript = await res.json();
      setTranscripts((prev) => [{
        id:       newTranscript.id,
        title:    newTranscript.title,
        language: newTranscript.language,
        duration: newTranscript.duration || "—",
        date:     new Date(newTranscript.created_at).toLocaleDateString("en-NG", {
          month: "short", day: "numeric", year: "numeric"
        }),
        status:   newTranscript.status,
        speakers: newTranscript.speakers || 1,
        content:  newTranscript.content || [],
      }, ...prev]);

      return newTranscript;
    } catch (err) {
      throw new Error(err.message || "Upload failed");
    }
  }

  async function deleteTranscript(id) {
    try {
      const token = localStorage.getItem("tng_token");
      await fetch(`${BASE_URL}/transcripts/${id}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTranscripts((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  return (
    <TranscriptContext.Provider value={{
      transcripts, active, loading, error,
      setActive, addTranscript, deleteTranscript, fetchTranscripts,
    }}>
      {children}
    </TranscriptContext.Provider>
  );
}

export function useTranscripts() {
  const ctx = useContext(TranscriptContext);
  if (!ctx) throw new Error("useTranscripts must be used inside TranscriptProvider");
  return ctx;
}
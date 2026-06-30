// import { useState, useCallback } from "react";
// import { useAudio } from "../../hooks/useAudio";
// import Sidebar from "../dashboard/Sidebar";
// import WaveformBar from "./WaveformBar";
// import TranscriptViewer from "./TranscriptViewer";
// import AISummary from "./AISummary";
// import Button from "../ui/Button";

// const LANGUAGES = ["Auto Detect", "Yoruba", "Hausa", "Igbo", "English"];

// export default function LiveRecording() {
//   const [sidebarOpen,      setSidebarOpen]      = useState(false);
//   const [lines,            setLines]            = useState([]);
//   const [showTranslation,  setShowTranslation]  = useState(false);
//   const [summary,          setSummary]          = useState(null);
//   const [isStreaming,      setIsStreaming]       = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState("auto");

//   // Handle incoming transcript lines from WebSocket
//   const handleLine = useCallback((line) => {
//     setLines((prev) => [...prev, { ...line, id: Date.now() + Math.random() }]);
//   }, []);

//   const handleDone = useCallback(() => {
//     setIsStreaming(false);
//   }, []);

//   const handleError = useCallback((err) => {
//     console.error("Transcription error:", err);
//     setIsStreaming(false);
//   }, []);

//   const { recording, formattedDuration, start, stop } = useAudio({
//     language: selectedLanguage,
//     onLine:   handleLine,
//     onDone:   handleDone,
//     onError:  handleError,
//   });

//   function handleRecord() {
//     if (recording) {
//       stop();
//       setIsStreaming(false);
//     } else {
//       setLines([]);
//       setSummary(null);
//       setIsStreaming(true);
//       start();
//     }
//   }

//   function handleReset() {
//     stop();
//     setLines([]);
//     setSummary(null);
//     setIsStreaming(false);
//   }

//   async function generateSummary() {
//     if (lines.length === 0) return;
//     try {
//       const res = await fetch("http://localhost:8000/summary", {
//         method:  "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           transcriptId: "live",
//           lines,
//           language: selectedLanguage,
//         }),
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setSummary({ ...data, duration: formattedDuration, speakers: 2 });
//       }
//     } catch (err) {
//       console.error("Summary error:", err);
//     }
//   }

//   return (
//     <div className="flex h-screen overflow-hidden bg-dark">
//       <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//       <main className="flex-1 overflow-y-auto">
//         <div className="px-4 md:px-8 py-6 md:py-8 max-w-4xl mx-auto">

//           {/* Header */}
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => setSidebarOpen(true)}
//                 className="md:hidden flex flex-col gap-1.5 cursor-pointer p-1"
//               >
//                 <span className="block w-5 h-0.5 bg-cream/70" />
//                 <span className="block w-5 h-0.5 bg-cream/70" />
//                 <span className="block w-5 h-0.5 bg-cream/70" />
//               </button>
//               <div>
//                 <h1 className="font-syne font-bold text-xl md:text-2xl text-cream">Live Recording</h1>
//                 <p className="text-sm text-cream/40 mt-0.5 hidden md:block">Transcribe in real time</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2 md:gap-3">
//               <select
//                 value={selectedLanguage}
//                 onChange={(e) => setSelectedLanguage(e.target.value)}
//                 className="bg-white/5 border border-subtle text-cream/70 text-xs rounded-lg px-2 md:px-3 py-2 outline-none focus:border-forest transition-colors cursor-pointer"
//               >
//                 {LANGUAGES.map((l) => (
//                   <option key={l} value={l.toLowerCase().replace(" ", "_")} className="bg-dark">{l}</option>
//                 ))}
//               </select>
//               <button
//                 onClick={handleReset}
//                 className="text-xs text-cream/40 hover:text-cream border border-subtle hover:border-white/20 px-2 md:px-3 py-2 rounded-lg transition-all cursor-pointer"
//               >
//                 Reset
//               </button>
//             </div>
//           </div>

//           {/* Recording panel */}
//           <div className="bg-surface border border-subtle rounded-2xl px-4 md:px-7 py-6 mb-4">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 {recording ? (
//                   <div className="flex items-center gap-2 text-accent text-xs font-medium">
//                     <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
//                     Recording
//                   </div>
//                 ) : (
//                   <span className="text-xs text-cream/30">Ready</span>
//                 )}
//                 <span className="text-xs text-cream/25 tabular-nums">{formattedDuration}</span>
//               </div>
//               {recording && (
//                 <div className="flex items-center gap-1.5 text-2xs text-accent border border-forest/30 bg-forest/10 px-2.5 py-1 rounded-full">
//                   <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
//                   Live transcribing
//                 </div>
//               )}
//             </div>

//             <WaveformBar active={recording || isStreaming} />

//             <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
//               <button
//                 onClick={() => setShowTranslation(!showTranslation)}
//                 className={`text-2xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
//                   showTranslation
//                     ? "bg-forest/20 text-accent border-forest/30"
//                     : "text-cream/40 border-subtle hover:text-cream"
//                 }`}
//               >
//                 {showTranslation ? "✓ Showing Translation" : "Translate to English"}
//               </button>

//               <div className="flex items-center gap-3">
//                 {lines.length > 0 && !recording && (
//                   <Button variant="ghost" size="sm" onClick={generateSummary}>
//                     ✨ AI Summary
//                   </Button>
//                 )}
//                 <button
//                   onClick={handleRecord}
//                   className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl transition-all duration-200 cursor-pointer shadow-lg ${
//                     recording
//                       ? "bg-red-500 hover:bg-red-600 shadow-red-500/25"
//                       : "bg-forest hover:bg-forest/90 shadow-forest/25"
//                   }`}
//                 >
//                   {recording ? "⏹" : "🎙"}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Empty state */}
//           {lines.length === 0 && !recording && (
//             <div className="text-center py-8">
//               <p className="text-sm text-cream/25">
//                 Press the mic button to start recording and transcribing in real time
//               </p>
//             </div>
//           )}

//           <TranscriptViewer
//             lines={lines}
//             showTranslation={showTranslation}
//             isStreaming={isStreaming || recording}
//           />

//           <AISummary summary={summary} onClose={() => setSummary(null)} />

//         </div>
//       </main>
//     </div>
//   );
// }

import { useState, useCallback } from "react";
import { useAudio } from "../../hooks/useAudio";
import Sidebar from "../dashboard/Sidebar";
import WaveformBar from "./WaveformBar";
import TranscriptViewer from "./TranscriptViewer";
import AISummary from "./AISummary";
import Button from "../ui/Button";

const LANGUAGES = [
  { label: "Auto Detect", value: "auto"    },
  { label: "Yoruba",      value: "yo"      },
  { label: "Hausa",       value: "ha"      },
  { label: "Igbo",        value: "ig"      },
  { label: "English",     value: "en"      },
];

export default function LiveRecording() {
  const [sidebarOpen,     setSidebarOpen]     = useState(false);
  const [lines,           setLines]           = useState([]);
  const [showTranslation, setShowTranslation] = useState(false);
  const [summary,         setSummary]         = useState(null);
  const [language,        setLanguage]        = useState("auto");
  const [partialText,     setPartialText]     = useState("");

  const handlePartial = useCallback((text) => {
    setPartialText(text);
  }, []);

  const handleFinal = useCallback((lineOrText) => {
    setPartialText("");
    const line = typeof lineOrText === "string"
      ? { id: Date.now(), speaker: "S1", text: lineOrText, translation: null, time: "00:00", lang: "auto", confidence: 0.9 }
      : lineOrText;
    if (line?.text?.trim()) {
      setLines((prev) => [...prev, { ...line, id: Date.now() + Math.random() }]);
    }
  }, []);

  const handleError = useCallback((err) => {
    console.error("Audio error:", err);
  }, []);

  const { isRecording, recording, formattedDuration, start, stop } = useAudio({
    language,
    onPartial: handlePartial,
    onFinal:   handleFinal,
    onError:   handleError,
  });

  function handleRecord() {
    if (isRecording) {
      stop();
    } else {
      setLines([]);
      setSummary(null);
      setPartialText("");
      start();
    }
  }

  function handleReset() {
    stop();
    setLines([]);
    setSummary(null);
    setPartialText("");
  }

  async function generateSummary() {
    if (lines.length === 0) return;
    try {
      const res = await fetch("http://localhost:8000/summary", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcriptId: "live", lines, language }),
      });
      if (res.ok) {
        const data = await res.json();
        setSummary({ ...data, duration: formattedDuration, speakers: 2 });
      }
    } catch (err) {
      console.error("Summary error:", err);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-dark">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto">
        <div className="px-4 md:px-8 py-6 md:py-8 max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
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
                <h1 className="font-syne font-bold text-xl md:text-2xl text-cream">Live Recording</h1>
                <p className="text-sm text-cream/40 mt-0.5 hidden md:block">Transcribe in real time</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white/5 border border-subtle text-cream/70 text-xs rounded-lg px-2 md:px-3 py-2 outline-none focus:border-forest transition-colors cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value} className="bg-dark">{l.label}</option>
                ))}
              </select>
              <button
                onClick={handleReset}
                className="text-xs text-cream/40 hover:text-cream border border-subtle hover:border-white/20 px-2 md:px-3 py-2 rounded-lg transition-all cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Recording panel */}
          <div className="bg-surface border border-subtle rounded-2xl px-4 md:px-7 py-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {isRecording ? (
                  <div className="flex items-center gap-2 text-accent text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Recording
                  </div>
                ) : (
                  <span className="text-xs text-cream/30">Ready</span>
                )}
                <span className="text-xs text-cream/25 tabular-nums">{formattedDuration}</span>
              </div>
              {isRecording && (
                <div className="flex items-center gap-1.5 text-2xs text-accent border border-forest/30 bg-forest/10 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Live transcribing
                </div>
              )}
            </div>

            <WaveformBar active={isRecording} />

            {/* Partial text — shows what's being processed */}
            {partialText && (
              <p className="text-xs text-cream/30 italic mt-3 px-1">
                Processing: {partialText}
              </p>
            )}

            <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`text-2xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  showTranslation
                    ? "bg-forest/20 text-accent border-forest/30"
                    : "text-cream/40 border-subtle hover:text-cream"
                }`}
              >
                {showTranslation ? "✓ Showing Translation" : "Translate to English"}
              </button>

              <div className="flex items-center gap-3">
                {lines.length > 0 && !isRecording && (
                  <Button variant="ghost" size="sm" onClick={generateSummary}>
                    ✨ AI Summary
                  </Button>
                )}
                <button
                  onClick={handleRecord}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl transition-all duration-200 cursor-pointer shadow-lg ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 shadow-red-500/25"
                      : "bg-forest hover:bg-forest/90 shadow-forest/25"
                  }`}
                >
                  {isRecording ? "⏹" : "🎙"}
                </button>
              </div>
            </div>
          </div>

          {/* Empty state */}
          {lines.length === 0 && !isRecording && (
            <div className="text-center py-8">
              <p className="text-sm text-cream/25">
                Press the mic button to start recording
              </p>
            </div>
          )}

          <TranscriptViewer
            lines={lines}
            showTranslation={showTranslation}
            isStreaming={isRecording}
          />

          <AISummary summary={summary} onClose={() => setSummary(null)} />

        </div>
      </main>
    </div>
  );
}
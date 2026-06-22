import { useState, useCallback } from "react";

const DEMO_LINES = [
  { id: 1, speaker: "S1", text: "Ẹ káàrọ̀ sir, mo dúpẹ́ pẹ̀ ẹ wá bá mi sọ ọ̀rọ̀ níi.", translation: "Good morning sir, thank you for coming to speak with me today.", time: "00:00:03", lang: "Yoruba",  confidence: 0.97 },
  { id: 2, speaker: "S2", text: "Yes, good morning. Ko si wahala, I'm happy to talk to you.",   translation: "Yes, good morning. No problem, I'm happy to talk to you.",          time: "00:00:07", lang: "Mixed",   confidence: 0.91 },
  { id: 3, speaker: "S1", text: "Ìbérè, sẹ́ ò lẹ̀ sọ fún mi nípa iṣẹ́ tí o ṣe?",               translation: "To start with, can you tell me about the work you do?",             time: "00:00:12", lang: "Yoruba",  confidence: 0.95 },
  { id: 4, speaker: "S2", text: "I've been working in fintech for about five years now.",         translation: null,                                                              time: "00:00:18", lang: "English", confidence: 0.99 },
  { id: 5, speaker: "S1", text: "Interesting. Ṣe o lè sọ fún wa nípa àwọn ìpèníjà tí o kojú?",  translation: "Interesting. Can you tell us about the challenges you faced?",      time: "00:00:25", lang: "Yoruba",  confidence: 0.93 },
];

export function useTranscript() {
  const [lines, setLines]           = useState([]);
  const [showTranslation, setShowTranslation] = useState(false);
  const [detectedLang, setDetectedLang]       = useState("Yoruba");
  const [isStreaming, setIsStreaming]         = useState(false);
  const [summary, setSummary]                 = useState(null);

  const startDemo = useCallback(() => {
    setLines([]);
    setIsStreaming(true);
    DEMO_LINES.forEach((line, i) => {
      setTimeout(() => {
        setLines((prev) => [...prev, line]);
        if (i === DEMO_LINES.length - 1) setIsStreaming(false);
      }, i * 1800);
    });
  }, []);

  const generateSummary = useCallback(() => {
    setSummary({
      keyPoints: [
        "Candidate has 5 years of experience in fintech",
        "Interview conducted in Yoruba with code-switching to English",
        "Discussion covered professional background and challenges",
      ],
      sentiment: "Positive",
      actionItems: ["Follow up on specific fintech projects", "Request CV"],
      duration: "00:03:45",
      speakers: 2,
    });
  }, []);

  const reset = useCallback(() => {
    setLines([]);
    setSummary(null);
    setIsStreaming(false);
  }, []);

  return {
    lines, showTranslation, setShowTranslation,
    detectedLang, isStreaming,
    summary, startDemo, generateSummary, reset,
  };
}
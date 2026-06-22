import whisper
import tempfile
import os
from dotenv import load_dotenv

load_dotenv()

MODEL_SIZE = os.getenv("WHISPER_MODEL", "base")
_model = None

def get_model():
    global _model
    if _model is None:
        print(f"Loading Whisper model: {MODEL_SIZE}")
        _model = whisper.load_model(MODEL_SIZE)
    return _model

LANG_MAP = {
    "yoruba":  "yo",
    "hausa":   "ha",
    "igbo":    "ig",
    "english": "en",
    "auto":    None,
}

def transcribe_audio(audio_bytes: bytes, language: str = "auto") -> dict:
    model = get_model()
    lang_code = LANG_MAP.get(language.lower())

    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        options = {}
        if lang_code:
            options["language"] = lang_code

        result = model.transcribe(tmp_path, **options, word_timestamps=True)

        segments = []
        for i, seg in enumerate(result.get("segments", [])):
            segments.append({
                "id":         i + 1,
                "start":      seg["start"],
                "end":        seg["end"],
                "text":       seg["text"].strip(),
                "lang":       result.get("language", "en").upper(),
                "confidence": round(seg.get("no_speech_prob", 0.05), 2),
            })

        return {
            "text":     result["text"],
            "segments": segments,
            "language": result.get("language", "en"),
            "duration": result["segments"][-1]["end"] if result["segments"] else 0,
        }
    finally:
        os.unlink(tmp_path)
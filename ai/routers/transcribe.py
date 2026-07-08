import asyncio
import time
import os
import httpx
from fastapi import APIRouter, Header, Request, UploadFile, File, Form
from fastapi.responses import JSONResponse
from services.whisper_service import transcribe_audio, transcribe_pcm, transcribe_with_scribe
from services.lang_detect import tag_codeswitches
from typing import Optional

router = APIRouter(prefix="/transcribe", tags=["transcribe"])

_transcription_lock = asyncio.Lock()

SUPPORTED_LANGUAGES = {"yo", "ig", "ha", "en"}

def normalize_language(language: Optional[str]) -> Optional[str]:
    """Return language code only if it's a supported Nigerian language, else None."""
    return language if language in SUPPORTED_LANGUAGES else None

def format_time(seconds: float) -> str:
    m = int(seconds // 60)
    s = int(seconds % 60)
    return f"{m:02d}:{s:02d}"

def build_lines(segments: list, speakers: int = 2) -> list:
    lines = []
    for i, seg in enumerate(segments):
        speaker = f"S{(i % speakers) + 1}"
        lines.append({
            "id":          i + 1,
            "speaker":     speaker,
            "text":        seg["text"],
            "translation": None,
            "time":        format_time(seg.get("start", 0)),
            "lang":        seg.get("lang", "English"),
            "confidence":  1 - seg.get("confidence", 0.05),
        })
    return lines


@router.post("")
async def transcribe_simple(
    file:     UploadFile    = File(...),
    language: Optional[str] = Form(None),
):
    """Simple endpoint for live recording — accepts WAV, returns plain text."""
    audio_bytes = await file.read()
    lang        = language if language in SUPPORTED_LANGUAGES else None
    result      = transcribe_with_scribe(audio_bytes, lang)

    text = " ".join(
        seg["text"] for seg in result["segments"] if seg["text"].strip()
    )

    return {"text": text, "language": result["language"]}


@router.post("/upload")
async def transcribe_upload(
    transcriptId: str,
    audioKey:     str,
    language:     str = "auto",
    request:      Request = None,
):
    """Called by Node.js after audio file is saved. Accepts audio bytes in request body."""
    try:
        content_type = request.headers.get("content-type", "")

        if "multipart/form-data" in content_type:
            form = await request.form()
            audio_file = form.get("audio")
            if audio_file:
                audio_bytes = await audio_file.read()
            else:
                return JSONResponse({"error": "No audio in form"}, status_code=400)
        else:
            audio_bytes = await request.body()

        if not audio_bytes:
            return JSONResponse({"error": "No audio data received"}, status_code=400)

        print(f"✅ Received audio: {len(audio_bytes)} bytes for transcript {transcriptId}")

        lang   = normalize_language(language)
        result = transcribe_with_scribe(audio_bytes, lang)

        segments = tag_codeswitches(result["segments"])
        lines    = build_lines(segments)

        api_url = os.getenv("API_SERVER_URL", "http://localhost:5000")
        print(f"📡 Patching transcript {transcriptId} at {api_url}")
        async with httpx.AsyncClient(timeout=30) as client:
            patch_res = await client.patch(
                f"{api_url}/api/transcripts/{transcriptId}/content",
                json={"content": lines, "speakers": 2, "status": "done"},
            )
            print(f"📡 Patch response: {patch_res.status_code} — {patch_res.text}")

        return {"ok": True, "lines": len(lines)}

    except Exception as e:
        print(f"Upload transcription error: {e}")
        return JSONResponse({"error": str(e)}, status_code=500)


@router.post("/stream")
async def transcribe_stream(
    request:       Request,
    x_language:    Optional[str] = Header(default=None),
    x_sample_rate: Optional[str] = Header(default=None),
):
    """Receives raw PCM or WebM audio chunks for live streaming transcription."""
    try:
        audio_data   = await request.body()
        content_type = request.headers.get("content-type", "")

        if not audio_data or len(audio_data) < 100:
            return JSONResponse({"line": None})

        if _transcription_lock.locked():
            print("⏭ Skipping — Whisper busy")
            return JSONResponse({"line": None})

        try:
            sample_rate = int(x_sample_rate or 16000)
        except ValueError:
            sample_rate = 16000

        async with _transcription_lock:
            lang = normalize_language(x_language)

            if "pcm" in content_type:
                result = transcribe_pcm(audio_data, lang, sample_rate)
            else:
                result = transcribe_with_scribe(audio_data, lang)

            if not result["segments"]:
                return JSONResponse({"line": None})

            seg  = result["segments"][0]
            line = {
                "id":          int(time.time()),
                "speaker":     "S1",
                "text":        seg["text"],
                "translation": None,
                "time":        format_time(seg.get("start", 0)),
                "lang":        seg.get("lang", "English"),
                "confidence":  1 - seg.get("confidence", 0.05),
            }
            return JSONResponse({"line": line})

    except Exception as e:
        print(f"Stream error: {e}")
        return JSONResponse({"line": None, "error": str(e)}, status_code=500)


@router.post("/test")
async def transcribe_test(request: Request):
    """Test endpoint — transcribe an uploaded file directly."""
    audio_bytes = await request.body()
    result      = transcribe_with_scribe(audio_bytes, None)
    segments    = tag_codeswitches(result["segments"])
    lines       = build_lines(segments)
    return {
        "language": result["language"],
        "duration": result["duration"],
        "lines":    lines,
    }
from fastapi import APIRouter, Header
from fastapi.responses import JSONResponse
from services.whisper_service import transcribe_audio
from services.lang_detect import tag_codeswitches
from typing import Optional
import time

router = APIRouter(prefix="/transcribe", tags=["transcribe"])

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

@router.post("/upload")
async def transcribe_upload(
    transcriptId: str,
    audioKey:     str,
    language:     str = "auto",
):
    import os, httpx
    from dotenv import load_dotenv
    load_dotenv()

    # Build path to uploads folder — goes up from ai/routers/ to project root, then into uploads/
    base_dir    = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    uploads_dir = os.path.join(base_dir, "uploads")
    audio_path  = os.path.join(uploads_dir, audioKey)

    print(f"Looking for audio file at: {audio_path}")

    if not os.path.exists(audio_path):
        print(f"❌ File not found: {audio_path}")
        print(f"Files in uploads dir: {os.listdir(uploads_dir) if os.path.exists(uploads_dir) else 'DIR NOT FOUND'}")
        return JSONResponse({"error": f"Audio file not found: {audioKey}"}, status_code=404)

    with open(audio_path, "rb") as f:
        audio_bytes = f.read()

    print(f"✅ Audio file loaded: {len(audio_bytes)} bytes")

    result   = transcribe_audio(audio_bytes, language)
    segments = tag_codeswitches(result["segments"])
    lines    = build_lines(segments)

    api_url = os.getenv("API_SERVER_URL", "http://localhost:5000")
    async with httpx.AsyncClient() as client:
        await client.patch(
            f"{api_url}/api/transcripts/{transcriptId}/content",
            json={"content": lines, "speakers": 2, "status": "done"},
        )
    return {"ok": True, "lines": len(lines)}

@router.post("/stream")
async def transcribe_stream(
    audio_data: bytes,
    x_language: Optional[str] = Header(default="auto"),
):
    try:
        result = transcribe_audio(audio_data, x_language or "auto")
        if not result["segments"]:
            return JSONResponse({"line": None})

        seg = result["segments"][0]
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
        return JSONResponse({"line": None, "error": str(e)}, status_code=500)

from fastapi import UploadFile, File

@router.post("/test")
async def transcribe_test(file: UploadFile = File(...)):
    """Test endpoint — transcribe an uploaded file directly without S3."""
    audio_bytes = await file.read()
    result = transcribe_audio(audio_bytes, "auto")
    segments = tag_codeswitches(result["segments"])
    lines = build_lines(segments)
    return {
        "language": result["language"],
        "duration": result["duration"],
        "lines":    lines,
    }
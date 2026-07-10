import os
import tempfile
from elevenlabs.client import ElevenLabs

SUPPORTED_LANGUAGES = {"yo", "ig", "ha", "en"}

def get_client():
    return ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

def transcribe_with_scribe(audio_bytes: bytes, language: str = None) -> dict:
    """Transcribe audio using ElevenLabs Scribe API."""
    client     = get_client()
    lang_code  = language if language in SUPPORTED_LANGUAGES else None
    tmp_path   = tempfile.mktemp(suffix=".m4a")

    with open(tmp_path, "wb") as f:
        f.write(audio_bytes)

    try:
        with open(tmp_path, "rb") as f:
            result = client.speech_to_text.convert(
                file=f,
                model_id="scribe_v1",
                language_code=lang_code,
                diarize=True,
            )

        full_text = result.text or ""
        segments  = []

        if full_text.strip():
            import re
            sentences = re.split(r'(?<=[.!?])\s+', full_text.strip())
            for sentence in sentences:
                if sentence.strip():
                    segments.append({
                        "text":       sentence.strip(),
                        "start":      0,
                        "end":        0,
                        "confidence": 0.9,
                    })

        return {
            "language": result.language_code or "en",
            "duration": 0,
            "segments": segments,
        }

    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


# Keep these as aliases so existing code doesn't break
def transcribe_audio(audio_bytes: bytes, language: str = None) -> dict:
    return transcribe_with_scribe(audio_bytes, language)

def transcribe_pcm(pcm_bytes: bytes, language: str = None, sample_rate: int = 16000) -> dict:
    """Convert PCM to WAV then transcribe with Scribe."""
    import struct
    wav_path        = tempfile.mktemp(suffix=".wav")
    num_channels    = 1
    bits_per_sample = 16
    byte_rate       = sample_rate * num_channels * bits_per_sample // 8
    block_align     = num_channels * bits_per_sample // 8
    data_size       = len(pcm_bytes)

    with open(wav_path, "wb") as f:
        f.write(b"RIFF")
        f.write(struct.pack("<I", 36 + data_size))
        f.write(b"WAVE")
        f.write(b"fmt ")
        f.write(struct.pack("<I", 16))
        f.write(struct.pack("<H", 1))
        f.write(struct.pack("<H", num_channels))
        f.write(struct.pack("<I", sample_rate))
        f.write(struct.pack("<I", byte_rate))
        f.write(struct.pack("<H", block_align))
        f.write(struct.pack("<H", bits_per_sample))
        f.write(b"data")
        f.write(struct.pack("<I", data_size))
        f.write(pcm_bytes)

    try:
        with open(wav_path, "rb") as f:
            audio_bytes = f.read()
        return transcribe_with_scribe(audio_bytes, language)
    finally:
        if os.path.exists(wav_path):
            os.unlink(wav_path)
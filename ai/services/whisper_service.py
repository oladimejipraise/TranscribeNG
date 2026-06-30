# import whisper
# import tempfile
# import os
# import subprocess

# _model = None

# def get_model():
#     global _model
#     if _model is None:
#         model_name = os.getenv("WHISPER_MODEL", "base")
#         print(f"Loading Whisper model: {model_name}")
#         _model = whisper.load_model(model_name)
#     return _model

# def convert_to_wav(audio_bytes: bytes) -> str:
#     """Try multiple formats to convert audio bytes to WAV. Returns WAV path."""
#     wav_path = tempfile.mktemp(suffix=".wav")

#     # Try each format until one works
#     formats = ["webm", "ogg", "mp4", "matroska", None]

#     for fmt in formats:
#         # Write to temp file
#         ext = f".{fmt}" if fmt else ".audio"
#         tmp_path = tempfile.mktemp(suffix=ext)
#         with open(tmp_path, "wb") as f:
#             f.write(audio_bytes)

#         try:
#             cmd = ["ffmpeg", "-y"]
#             if fmt:
#                 cmd += ["-f", fmt]
#             cmd += ["-i", tmp_path, "-ar", "16000", "-ac", "1", "-f", "wav", wav_path]

#             result = subprocess.run(cmd, capture_output=True, timeout=60)

#             if result.returncode == 0 and os.path.exists(wav_path):
#                 print(f"✅ Converted audio using format: {fmt or 'auto'}")
#                 return wav_path
#         except Exception as e:
#             print(f"Format {fmt} failed: {e}")
#         finally:
#             if os.path.exists(tmp_path):
#                 os.unlink(tmp_path)

#     raise Exception("Could not convert audio — all formats failed")


# def transcribe_audio(audio_bytes: bytes, language: str = "auto") -> dict:
#     model    = get_model()
#     wav_path = None

#     try:
#         wav_path = convert_to_wav(audio_bytes)

#         options = {}
#         if language and language not in ("auto", "auto_detect", "auto detect"):
#             options["language"] = language

#         transcription = model.transcribe(wav_path, **options, word_timestamps=True)

#         segments = []
#         for seg in transcription.get("segments", []):
#             segments.append({
#                 "text":       seg["text"].strip(),
#                 "start":      seg["start"],
#                 "end":        seg["end"],
#                 "confidence": 1 - seg.get("avg_logprob", 0),
#             })

#         return {
#             "language": transcription.get("language", "en"),
#             "duration": transcription.get("duration", 0),
#             "segments": segments,
#         }

#     finally:
#         if wav_path and os.path.exists(wav_path):
#             os.unlink(wav_path)


import whisper
import tempfile
import os
import subprocess
import struct

_model = None

SUPPORTED_LANGUAGES = {"yo", "ig", "ha", "en"}

def get_model():
    global _model
    if _model is None:
        model_name = os.getenv("WHISPER_MODEL", "base")
        print(f"Loading Whisper model: {model_name}")
        _model = whisper.load_model(model_name)
    return _model

def convert_to_wav(audio_bytes: bytes) -> str:
    wav_path = tempfile.mktemp(suffix=".wav")
    formats  = ["webm", "ogg", "mp4", "matroska", None]

    for fmt in formats:
        ext      = f".{fmt}" if fmt else ".audio"
        tmp_path = tempfile.mktemp(suffix=ext)

        with open(tmp_path, "wb") as f:
            f.write(audio_bytes)

        try:
            cmd = ["ffmpeg", "-y"]
            if fmt:
                cmd += ["-f", fmt]
            cmd += ["-i", tmp_path, "-ar", "16000", "-ac", "1", "-f", "wav", wav_path]

            result = subprocess.run(cmd, capture_output=True, timeout=60)

            if result.returncode == 0 and os.path.exists(wav_path):
                print(f"✅ Converted audio using format: {fmt or 'auto'}")
                return wav_path
        except Exception as e:
            print(f"Format {fmt} failed: {e}")
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    raise Exception("Could not convert audio — all formats failed")


def pcm_to_wav(pcm_bytes: bytes, sample_rate: int = 16000) -> str:
    """Convert raw Int16 PCM bytes to a WAV file."""
    wav_path        = tempfile.mktemp(suffix=".wav")
    num_channels    = 1
    bits_per_sample = 16
    byte_rate       = sample_rate * num_channels * bits_per_sample // 8
    block_align     = num_channels * bits_per_sample // 8
    data_size       = len(pcm_bytes)
    chunk_size      = 36 + data_size

    with open(wav_path, "wb") as f:
        f.write(b"RIFF")
        f.write(struct.pack("<I", chunk_size))
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

    print(f"✅ PCM → WAV: {len(pcm_bytes)} bytes, {len(pcm_bytes) / (sample_rate * 2):.1f}s")
    return wav_path


def _run_whisper(wav_path: str, language: Optional[str] = None) -> dict:
    """Run Whisper on a WAV file. Pass language only if explicitly supported."""
    model  = get_model()

    # Only include language kwarg if it's a supported code
    # None = let Whisper auto-detect
    kwargs = {}
    if language and language in SUPPORTED_LANGUAGES:
        kwargs["language"] = language

    transcription = model.transcribe(wav_path, **kwargs, word_timestamps=True)

    segments = []
    for seg in transcription.get("segments", []):
        if seg["text"].strip():
            segments.append({
                "text":       seg["text"].strip(),
                "start":      seg["start"],
                "end":        seg["end"],
                "confidence": 1 - seg.get("avg_logprob", 0),
            })

    return {
        "language": transcription.get("language", "en"),
        "duration": transcription.get("duration", 0),
        "segments": segments,
    }


def transcribe_audio(audio_bytes: bytes, language: Optional[str] = None) -> dict:
    """Transcribe audio file bytes (WebM, M4A, MP3, WAV etc)."""
    wav_path = None
    try:
        wav_path = convert_to_wav(audio_bytes)
        return _run_whisper(wav_path, language)
    finally:
        if wav_path and os.path.exists(wav_path):
            os.unlink(wav_path)


def transcribe_pcm(pcm_bytes: bytes, language: Optional[str] = None, sample_rate: int = 16000) -> dict:
    """Transcribe raw Int16 PCM audio from browser ScriptProcessor."""
    wav_path = None
    try:
        wav_path = pcm_to_wav(pcm_bytes, sample_rate)
        return _run_whisper(wav_path, language)
    finally:
        if wav_path and os.path.exists(wav_path):
            os.unlink(wav_path)
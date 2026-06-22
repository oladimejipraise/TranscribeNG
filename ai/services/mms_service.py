MMS_AVAILABLE = False

try:
    from transformers import pipeline
    MMS_AVAILABLE = True
except ImportError:
    print("⚠ Transformers not available — MMS fallback disabled")

_pipe = None

def get_mms_pipeline(language: str):
    global _pipe
    lang_codes = {"yoruba": "yor", "hausa": "hau", "igbo": "ibo"}
    lang_code  = lang_codes.get(language.lower(), "yor")

    if _pipe is None and MMS_AVAILABLE:
        _pipe = pipeline(
            task="automatic-speech-recognition",
            model="facebook/mms-1b-fl102",
        )
        _pipe.tokenizer.set_target_lang(lang_code)
        _pipe.model.load_adapter(lang_code)
    return _pipe

def transcribe_with_mms(audio_bytes: bytes, language: str = "yoruba") -> dict:
    if not MMS_AVAILABLE:
        return {"text": "", "segments": [], "language": language}

    try:
        pipe = get_mms_pipeline(language)
        result = pipe(audio_bytes)
        return {
            "text":     result["text"],
            "segments": [{"text": result["text"], "lang": language.capitalize()}],
            "language": language,
        }
    except Exception as e:
        print(f"MMS error: {e}")
        return {"text": "", "segments": [], "language": language}
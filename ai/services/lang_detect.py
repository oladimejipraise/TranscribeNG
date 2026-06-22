from langdetect import detect
from typing import List

NIGERIAN_MARKERS = {
    "yoruba":  ["ẹ", "ọ", "ṣ", "káàrọ̀", "dúpẹ́", "wahala", "abi", "jẹ"],
    "hausa":   ["yanzu", "kai", "wadata", "sosai", "allah", "mai", "sai"],
    "igbo":    ["ọ", "nna", "biko", "chukwu", "ime", "nke", "ụ"],
    "pidgin":  ["don", "dey", "wetin", "make", "oga", "abeg", "dem"],
}

def detect_language(text: str) -> str:
    text_lower = text.lower()
    scores = {}
    for lang, markers in NIGERIAN_MARKERS.items():
        score = sum(1 for m in markers if m in text_lower)
        if score > 0:
            scores[lang] = score

    if scores:
        return max(scores, key=scores.get).capitalize()

    try:
        detected = detect(text)
        return "English" if detected == "en" else detected.capitalize()
    except Exception:
        return "English"

def tag_codeswitches(segments: List[dict]) -> List[dict]:
    for seg in segments:
        seg["lang"] = detect_language(seg["text"])
    return segments
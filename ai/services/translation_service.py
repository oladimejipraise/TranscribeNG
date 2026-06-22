import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

LANGUAGE_NAMES = {
    "yo": "Yoruba",
    "ha": "Hausa", 
    "ig": "Igbo",
    "en": "English",
    "auto": "Nigerian language",
}

async def translate_lines(lines: list, source_language: str = "auto") -> list:
    """
    Translate transcript lines to English using Claude.
    Returns lines with translation field filled in.
    """
    # Filter lines that need translation (not already English)
    needs_translation = [
        line for line in lines 
        if line.get("lang", "").lower() not in ["english", "en"]
    ]
    
    if not needs_translation:
        # All lines are already English
        for line in lines:
            line["translation"] = line["text"]
        return lines

    # Build translation prompt
    texts_to_translate = "\n".join([
        f"{i+1}. {line['text']}" 
        for i, line in enumerate(needs_translation)
    ])

    lang_name = LANGUAGE_NAMES.get(source_language.lower(), "Nigerian language")

    prompt = f"""You are translating a {lang_name} interview transcript to English.
Some text may include code-switching between {lang_name}, Pidgin English, and English.

Translate each line accurately and naturally. Keep the meaning and tone.
For lines already in English, keep them as is.

Lines to translate:
{texts_to_translate}

Respond ONLY with a JSON array of translations in the same order, like this:
["translation 1", "translation 2", "translation 3"]

No other text, no markdown, just the JSON array."""

    msg = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}],
    )

    import json
    translations = json.loads(msg.content[0].text.strip())

    # Map translations back to lines
    trans_index = 0
    for line in lines:
        if line.get("lang", "").lower() not in ["english", "en"]:
            if trans_index < len(translations):
                line["translation"] = translations[trans_index]
                trans_index += 1
        else:
            line["translation"] = line["text"]

    return lines
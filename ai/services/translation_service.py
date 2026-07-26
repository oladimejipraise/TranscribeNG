import os
import json
import re
from anthropic import AsyncAnthropic
from dotenv import load_dotenv

load_dotenv()

client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

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
    Never raises — on any failure, returns lines untranslated so export still works.
    """
    try:
        needs_translation = [
            line for line in lines
            if line.get("lang", "").lower() not in ["english", "en"]
        ]

        if not needs_translation:
            for line in lines:
                line["translation"] = line["text"]
            return lines

        texts_to_translate = "\n".join([
            f"{i+1}. {line['text']}"
            for i, line in enumerate(needs_translation)
        ])

        lang_name = LANGUAGE_NAMES.get((source_language or "auto").lower(), "Nigerian language")

        prompt = f"""You are translating a {lang_name} interview transcript to English.
Some text may include code-switching between {lang_name}, Pidgin English, and English.

Translate each line accurately and naturally. Keep the meaning and tone.
For lines already in English, keep them as is.

Lines to translate:
{texts_to_translate}

Respond ONLY with a JSON array of translations in the same order, like this:
["translation 1", "translation 2", "translation 3"]

No other text, no markdown, just the JSON array."""

        msg = await client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}],
        )

        raw = msg.content[0].text.strip()

        # Strip markdown code fences if Claude added them
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)

        translations = json.loads(raw)

        trans_index = 0
        for line in lines:
            if line.get("lang", "").lower() not in ["english", "en"]:
                if trans_index < len(translations):
                    line["translation"] = translations[trans_index]
                    trans_index += 1
            else:
                line["translation"] = line["text"]

        return lines

    except Exception as e:
        print(f"⚠️ Translation failed, exporting without translations: {e}")
        for line in lines:
            line.setdefault("translation", None)
        return lines
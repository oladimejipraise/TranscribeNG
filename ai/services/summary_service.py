import os
from dotenv import load_dotenv

load_dotenv()

async def generate_summary(lines: list, language: str) -> dict:
    transcript_text = "\n".join(
        f"{line['speaker']} [{line['time']}]: {line['text']}" for line in lines
    )

    prompt = f"""You are analysing a Nigerian interview transcript in {language}.

Transcript:
{transcript_text}

Respond ONLY with valid JSON in this exact format:
{{
  "keyPoints": ["point 1", "point 2", "point 3"],
  "actionItems": ["action 1", "action 2"],
  "sentiment": "Positive" | "Neutral" | "Negative"
}}"""

    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    if anthropic_key:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=anthropic_key)
            msg = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=512,
                messages=[{"role": "user", "content": prompt}],
            )
            import json
            return json.loads(msg.content[0].text)
        except Exception as e:
            print(f"Claude summary error: {e}")

    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=openai_key)
            res = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
            )
            import json
            return json.loads(res.choices[0].message.content)
        except Exception as e:
            print(f"GPT summary error: {e}")

    return {
        "keyPoints":   ["Summary unavailable — add API key to ai/.env"],
        "actionItems": ["Configure ANTHROPIC_API_KEY or OPENAI_API_KEY"],
        "sentiment":   "Neutral",
    }
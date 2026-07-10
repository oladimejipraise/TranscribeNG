from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import transcribe, summary, export
import os

load_dotenv()

app = FastAPI(
    title="TranscribeNG AI Service",
    description="ElevenLabs Scribe transcription for Nigerian languages",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transcribe.router)
app.include_router(summary.router)
app.include_router(export.router)

@app.get("/health")
def health():
    return {"status": "ok", "service": "transcribeng-ai"}
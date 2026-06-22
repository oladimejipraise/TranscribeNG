from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import transcribe, summary
from routers import export

load_dotenv()

app = FastAPI(
    title="TranscribeNG AI Service",
    description="Whisper transcription + AI summary for Nigerian languages",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transcribe.router)
app.include_router(summary.router)
app.include_router(export.router)

@app.get("/health")
def health():
    return {"status": "ok", "service": "transcribeng-ai"}
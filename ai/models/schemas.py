from pydantic import BaseModel
from typing import Optional, List

class TranscriptLine(BaseModel):
    id:          int
    speaker:     str
    text:        str
    translation: Optional[str] = None
    time:        str
    lang:        str
    confidence:  float

class TranscriptionResult(BaseModel):
    transcriptId: str
    lines:        List[TranscriptLine]
    language:     str
    duration:     str
    speakers:     int

class SummaryRequest(BaseModel):
    transcriptId: str
    lines:        List[TranscriptLine]
    language:     str

class SummaryResult(BaseModel):
    keyPoints:   List[str]
    actionItems: List[str]
    sentiment:   str
    duration:    str
    speakers:    int
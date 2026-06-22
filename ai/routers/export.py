from fastapi import APIRouter
from fastapi.responses import Response
from pydantic import BaseModel
from services.export_service import build_docx, build_pdf, build_txt, build_srt
from services.translation_service import translate_lines

router = APIRouter(prefix="/export", tags=["export"])

class ExportRequest(BaseModel):
    lines:               list
    title:               str  = "Transcript"
    format:              str  = "docx"
    content_type:        str  = "both"
    font_name:           str  = "Calibri"
    font_size:           int  = 12
    include_speakers:    bool = True
    include_timestamps:  bool = True
    language:            str  = "auto"

@router.post("")
async def export_transcript(body: ExportRequest):
    lines = body.lines

    if body.content_type in ["both", "translation"]:
        lines = await translate_lines(lines, body.language)

    fmt = body.format.lower()

    if fmt == "docx":
        content    = build_docx(lines=lines, title=body.title, content_type=body.content_type, font_name=body.font_name, font_size=body.font_size, include_speakers=body.include_speakers, include_timestamps=body.include_timestamps)
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        filename   = f"{body.title}.docx"

    elif fmt == "pdf":
        content    = build_pdf(lines=lines, title=body.title, content_type=body.content_type, font_name=body.font_name, font_size=body.font_size, include_speakers=body.include_speakers, include_timestamps=body.include_timestamps)
        media_type = "application/pdf"
        filename   = f"{body.title}.pdf"

    elif fmt == "txt":
        content    = build_txt(lines=lines, content_type=body.content_type, include_speakers=body.include_speakers, include_timestamps=body.include_timestamps)
        media_type = "text/plain"
        filename   = f"{body.title}.txt"

    elif fmt == "srt":
        content    = build_srt(lines=lines)
        media_type = "text/plain"
        filename   = f"{body.title}.srt"

    else:
        return {"error": f"Unsupported format: {fmt}"}

    return Response(
        content    = content,
        media_type = media_type,
        headers    = {"Content-Disposition": f'attachment; filename="{filename}"'},
    )
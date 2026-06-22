from fastapi import APIRouter
from models.schemas import SummaryRequest
from services.summary_service import generate_summary

router = APIRouter(prefix="/summary", tags=["summary"])

@router.post("")
async def create_summary(body: SummaryRequest):
    summary = await generate_summary(
        lines=[line.dict() for line in body.lines],
        language=body.language,
    )
    return {
        **summary,
        "duration": "00:03:45",
        "speakers": 2,
    }
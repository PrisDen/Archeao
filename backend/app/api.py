from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, ValidationError

from app.logging import get_logger
from app.schemas import ParseInput, ParseResult

logger = get_logger(__name__)
router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


class ErrorResponse(BaseModel):
    error: str
    message: str
    retry_count: int


@router.get("/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
async def health_check() -> HealthResponse:
    from app.settings import settings

    logger.info("Health check requested")
    return HealthResponse(
        status="healthy",
        service=settings.app_name,
        version=settings.app_version,
    )


@router.post("/parse", response_model=ParseResult, status_code=status.HTTP_200_OK)
async def parse_transcript(request: ParseInput) -> ParseResult:
    logger.info(f"Parse request received, input length: {len(request.raw_text)}")

    try:
        from app.agent import parse_transcript as agent_parse
        from app.settings import settings

        result = await agent_parse(request)
        return result

    except ValidationError as e:
        logger.error(f"Validation error: {str(e)}", exc_info=True)
        retry_count = settings.max_retries
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "MODEL_OUTPUT_INVALID",
                "message": "The agent failed to produce valid structured output.",
                "retry_count": retry_count,
            },
        )
    except Exception as e:
        logger.error(f"Error processing transcript: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "PROCESSING_FAILED",
                "message": "An unexpected error occurred during processing.",
                "retry_count": 0,
            },
        )

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
    error_code: str
    user_message: str
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
                "error_code": "MODEL_OUTPUT_INVALID",
                "user_message": "LLM unavailable or parsing failed",
                "retry_count": retry_count,
            },
        )
    except Exception as e:
        error_str = str(e).lower()
        logger.error(f"Error processing transcript: {str(e)}", exc_info=True)
        
        if "api" in error_str and ("key" in error_str or "auth" in error_str or "401" in error_str):
            error_code = "INVALID_API_KEY"
            user_message = "Invalid or missing LLM API key"
        elif "429" in error_str or "quota" in error_str or "rate" in error_str or "limit" in error_str:
            error_code = "RATE_LIMIT_EXCEEDED"
            user_message = "LLM quota or rate limit exceeded"
        elif "token" in error_str and ("limit" in error_str or "exceed" in error_str or "too long" in error_str):
            error_code = "TOKEN_LIMIT_EXCEEDED"
            user_message = "Input exceeds model token limit"
        else:
            error_code = "PROCESSING_FAILED"
            user_message = "LLM unavailable or parsing failed"
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error_code": error_code,
                "user_message": user_message,
                "retry_count": 0,
            },
        )

import os
import time

from pydantic import ValidationError
from pydantic_ai import Agent

from app.logging import get_logger
from app.schemas import ParseInput, ParseResult
from app.settings import settings

logger = get_logger(__name__)

# Set Gemini API key in environment
os.environ["GEMINI_API_KEY"] = settings.gemini_api_key

agent = Agent(
    "gemini-2.0-flash-exp",
    output_type=ParseResult,
    system_prompt="""Parse unstructured text into structured data.

Extract:
- Decisions: Agreements or conclusions. Include confidence (0.0-1.0).
- Tasks: Actionable items with:
  - priority: P0, P1, P2, P3
  - domain: frontend, backend, infra, data, product, design, qa, unknown
  - complexity: 1, 2, 3, 5, 8, 13 (Fibonacci points)
  - owner_hint: Role or team (not person name), or null
  - confidence: 0.0-1.0
  - reasoning: Brief explanation (1-2 sentences max), or null
- Noise: Greetings, filler, repetition, vague complaints

Rules:
- Use exact enum values only
- Use "unknown" domain if unclear
- Do not invent IDs, stakeholders, dependencies, or deadlines
- Keep reasoning concise""",
    output_retries=settings.max_retries,
)


async def parse_transcript(input_data: ParseInput) -> ParseResult:
    start_time = time.time()
    logger.info(f"Starting parse, input length: {len(input_data.raw_text)}")

    validation_feedback: str | None = None
    last_error: Exception | None = None
    total_attempts = 1 + settings.max_retries

    for attempt in range(1, total_attempts + 1):
        try:
            logger.info(f"Parse attempt {attempt}/{total_attempts}")

            prompt = input_data.raw_text
            if validation_feedback:
                prompt = f"""{input_data.raw_text}

PREVIOUS ATTEMPT FAILED VALIDATION:
{validation_feedback}

Correct the errors and retry."""

            result = await agent.run(prompt)
            parsed_data = result.data
            validated_result = ParseResult.model_validate(parsed_data.model_dump())

            logger.info(
                f"Parse success: {len(validated_result.decisions)} decisions, "
                f"{len(validated_result.tasks)} tasks, {len(validated_result.noise)} noise"
            )

            processing_time_ms = int((time.time() - start_time) * 1000)
            validated_result.meta["input_length"] = len(input_data.raw_text)
            validated_result.meta["retry_count"] = attempt - 1
            validated_result.meta["model"] = settings.gemini_model
            validated_result.meta["processing_time_ms"] = processing_time_ms

            return validated_result

        except ValidationError as e:
            last_error = e
            error_details = []
            for error in e.errors():
                loc = " -> ".join(str(x) for x in error["loc"])
                error_details.append(f"{loc}: {error['msg']}")

            validation_feedback = "\n".join(error_details)
            logger.warning(f"Validation failed on attempt {attempt}: {validation_feedback}")

            if attempt == total_attempts:
                logger.error("Max retries reached")
                break

        except Exception as e:
            last_error = e
            logger.error(f"Unexpected error on attempt {attempt}: {str(e)}", exc_info=True)

            if attempt == total_attempts:
                break

    logger.error("Parse failed after all retries")
    raise last_error or Exception("Parse failed")

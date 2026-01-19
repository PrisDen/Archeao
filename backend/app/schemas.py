from typing import Any

from pydantic import BaseModel, Field

from app.enums import Complexity, Domain, Priority


class ParseInput(BaseModel):
    raw_text: str = Field(..., min_length=20)


class Decision(BaseModel):
    statement: str
    confidence: float = Field(..., ge=0.0, le=1.0)


class Task(BaseModel):
    title: str
    description: str
    priority: Priority
    complexity: Complexity
    domain: Domain
    owner_hint: str | None = None
    confidence: float = Field(..., ge=0.0, le=1.0)
    reasoning: str | None = None


class NoiseItem(BaseModel):
    text: str
    reason: str


class ParseResult(BaseModel):
    decisions: list[Decision] = Field(default_factory=list)
    tasks: list[Task] = Field(default_factory=list)
    noise: list[NoiseItem] = Field(default_factory=list)
    meta: dict[str, Any] = Field(default_factory=dict)

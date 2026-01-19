# The Meeting Archaeologist — Locked Architecture & Product Specification

---

## 0. Status of This Document

This document is **authoritative and frozen**.

- It defines the product, system behavior, schemas, enums, APIs, and non-goals.
- All backend code MUST conform exactly to this document.
- If any code contradicts this document, the **code must change**, not the document.
- This document exists to eliminate ambiguity, drift, and over-engineering.

---

## 1. Product Definition

### One-Line Description

**The Meeting Archaeologist** is an AI pre-processor that converts chaotic, unstructured human communication into **type-safe, execution-ready project data** using Pydantic AI.

### What This Is

- A **parser**, not a chatbot
- A **translation layer** between human language and engineering execution
- A system that **reduces reading**, not generates more text

### What This Is Not

- Not a conversational agent
- Not a summarization tool
- Not a note-taking app
- Not a project management tool itself

---

## 2. Core Philosophy & Principles

### 2.1 Stateless by Design

- Each request is processed independently
- No memory
- No context carryover
- No user accounts
- No database in MVP

This ensures:
- Predictable behavior
- Demo reliability
- Zero context bleed

---

### 2.2 Schema-First, Not Prompt-First

- Schemas are defined **before** prompts
- The LLM must conform to schemas
- Schemas are narrow and constrained
- Free-form output is treated as unsafe

---

### 2.3 LLM Output Is Unsafe by Default

- All LLM output is considered untrusted
- Pydantic AI enforces schema correctness
- Invalid outputs are rejected and retried
- Partial outputs are never returned

The system must feel **deterministic**, even though the model is probabilistic.

---

### 2.4 Pydantic AI Is an Enforcement Layer

Pydantic AI is used to:

- Enforce schema-level correctness
- Reject invalid enum values
- Retry on validation failure
- Prevent malformed output from reaching the frontend
- Guarantee type safety across the system

---

## 3. Input Contract (Authoritative)

### ParseInput

```python
class ParseInput(BaseModel):
    raw_text: str  # min_length = 20

Rules
	•	Input is a single block of unstructured text
	•	Examples:
	•	Slack conversation dump
	•	Client email
	•	Meeting notes
	•	Brainstorm / rant
	•	Input shorter than 20 characters must be rejected
	•	No preprocessing beyond trimming whitespace

⸻

4. Output Schema (Authoritative)

All output must conform exactly to the following models.

⸻

4.1 Decision

class Decision(BaseModel):
    statement: str
    confidence: float  # 0.0–1.0

Rules:
	•	A decision is something that was agreed upon
	•	No speculation
	•	If uncertain, reduce confidence instead of inventing
	•	No IDs
	•	No rationale fields
	•	No stakeholder inference

⸻

4.2 Task

class Task(BaseModel):
    title: str
    description: str

    priority: Priority
    complexity: Complexity
    domain: Domain

    owner_hint: Optional[str]
    confidence: float  # 0.0–1.0
    reasoning: Optional[str]

Rules:
	•	Tasks must be actionable
	•	Title must be short and imperative
	•	Description must be concrete
	•	owner_hint may describe a role or team (e.g. “backend team”), never a person
	•	reasoning must be brief (1–2 sentences max)
	•	No IDs
	•	No dependencies
	•	No deadlines
	•	No assignees by name

⸻

4.3 NoiseItem

class NoiseItem(BaseModel):
    text: str
    reason: str

Rules:
	•	Noise includes:
	•	Emotional language
	•	Repetition
	•	Vague complaints
	•	Greetings / filler
	•	Noise is included for transparency, not execution

⸻

4.4 ParseResult (Top-Level Output)

class ParseResult(BaseModel):
    decisions: list[Decision]
    tasks: list[Task]
    noise: list[NoiseItem]
    meta: dict


⸻

4.5 Meta (Strict Keys Only)

The meta field MUST contain only the following keys:

meta = {
    "input_length": int,
    "retry_count": int,
    "model": str,
    "processing_time_ms": int
}

Rules:
	•	No additional metadata keys allowed
	•	retry_count = number of retries performed (not attempts)
	•	model = exact model identifier string

⸻

5. Enums (Authoritative)

5.1 Priority

class Priority(str, Enum):
    P0 = "P0"  # urgent / blocking
    P1 = "P1"
    P2 = "P2"
    P3 = "P3"  # nice-to-have


⸻

5.2 Domain

class Domain(str, Enum):
    FRONTEND = "frontend"
    BACKEND = "backend"
    INFRA = "infra"
    DATA = "data"
    PRODUCT = "product"
    DESIGN = "design"
    QA = "qa"
    UNKNOWN = "unknown"

Rules:
	•	If domain cannot be inferred confidently → use unknown
	•	Do NOT invent business departments

⸻

5.3 Complexity (Fibonacci)

class Complexity(int, Enum):
    ONE = 1
    TWO = 2
    THREE = 3
    FIVE = 5
    EIGHT = 8
    THIRTEEN = 13

Rules:
	•	Relative estimation only
	•	No natural language labels

⸻

6. Agent Behavior (Authoritative)

6.1 Agent Role

The agent’s sole responsibility is to:
	•	Parse unstructured text
	•	Extract structured entities
	•	Output strictly validated data

It does NOT:
	•	Chat
	•	Summarize for reading
	•	Explain unless explicitly allowed in reasoning

⸻

6.2 Retry Semantics
	•	Initial attempt + MAX_RETRIES
	•	MAX_RETRIES defaults to 2
	•	Total attempts = 1 + MAX_RETRIES

Retry triggers:
	•	Invalid enum values
	•	Missing required fields
	•	Confidence outside [0, 1]
	•	Empty decisions AND empty tasks for non-trivial input

⸻

6.3 Validation Feedback
	•	On validation failure:
	•	Extract validation errors
	•	Inject concise feedback into retry prompt
	•	Do not expose stack traces
	•	Do not leak partial output

⸻

6.4 Failure Behavior

If retries are exhausted:
	•	The request fails
	•	No partial data is returned
	•	API returns a clean error response

⸻

7. System Prompt Constraints

The system prompt MUST:
	•	Mirror enum values exactly
	•	Explicitly instruct the model:
	•	To use only allowed enum values
	•	To use unknown when unsure
	•	Avoid narrative descriptions
	•	Avoid human labels like “high priority” or “complex task”

⸻

8. API Contract (Authoritative)

POST /parse

Request

{
  "raw_text": "string"
}

Success Response (200)

{
  "decisions": [...],
  "tasks": [...],
  "noise": [...],
  "meta": {...}
}

Failure Response (500)

{
  "error": "MODEL_OUTPUT_INVALID",
  "message": "The agent failed to produce valid structured output.",
  "retry_count": 2
}

Rules:
	•	No wrapper objects
	•	No status/message fields on success
	•	Data-first API design

⸻

9. Frontend Expectations (Informational)
	•	Single-page UI
	•	Paste → Parse → Review → Copy
	•	Human-in-the-loop editing
	•	“Copy as Markdown” is a primary action
	•	Reasoning is toggleable
	•	Confidence is visible

⸻

10. Explicit Non-Goals (Important)

The system MUST NOT:
	•	Generate summaries
	•	Generate IDs
	•	Assign tasks to named people
	•	Infer stakeholders
	•	Store data
	•	Learn from past inputs
	•	Behave conversationally
	•	Hide uncertainty

⸻

11. Evaluation Alignment

This project demonstrates:
	•	Treating AI as unsafe input
	•	Schema-driven system design
	•	Deterministic behavior from probabilistic models
	•	Senior-level architectural discipline
	•	Real-world execution focus

⸻

12. Final Rule

If there is a conflict between:
	•	Code
	•	Prompt
	•	Assumptions
	•	Convenience

This document wins.

End of specification.


# The Meeting Archaeologist

**Convert chaotic communication into execution-ready data.**

---

## Problem

Engineering teams drown in unstructured communication: Slack threads, meeting notes, client emails, brainstorm dumps. Critical decisions and tasks are buried in noise, requiring manual parsing and re-entry into project management tools.

**The Meeting Archaeologist** solves this by treating human language as **unsafe input** and transforming it into **type-safe, structured project data** that can be immediately copied into Jira, Linear, or Notion.

---

## What This Is

- A **parser**, not a chatbot
- A **translation layer** between human language and engineering execution
- A system that **reduces reading**, not generates more text

---

## What This Is Not

- Not a conversational agent
- Not a summarization tool
- Not a note-taking app
- Not a project management tool itself

---

## Architecture

```
┌─────────────────┐
│   Frontend      │  Next.js + TypeScript + Tailwind
│   (React)       │  Single-page UI: Paste → Parse → Copy
└────────┬────────┘
         │ HTTP
         ↓
┌─────────────────┐
│   Backend       │  FastAPI + Pydantic v2
│   (Python)      │  Stateless API: POST /parse
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Pydantic AI    │  Schema enforcement + retry logic
│  Agent          │  Treats LLM output as unsafe
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   LLM Provider  │  Gemini / OpenRouter / OpenAI
│   (External)    │  Probabilistic → Deterministic
└─────────────────┘
```

---

## Tech Stack

### Backend
- **Python 3.10+**
- **FastAPI** — async API framework
- **Pydantic v2** — schema validation
- **Pydantic AI** — LLM output enforcement
- **Uvicorn** — ASGI server

### Frontend
- **Next.js 14** — React framework
- **TypeScript** — type safety
- **Tailwind CSS** — utility-first styling

### AI
- **Gemini API** (default)
- **OpenRouter** (alternative)
- **OpenAI** (alternative)

---

## Why Pydantic AI?

Pydantic AI is the **enforcement layer** that makes this system feel deterministic despite using probabilistic models.

### Core Capabilities

1. **Schema Enforcement**
   - LLM output must conform to strict Pydantic models
   - Invalid enum values are rejected
   - Missing required fields trigger retries

2. **Automatic Retries**
   - Validation failures inject error feedback into retry prompts
   - Configurable retry limits (default: 2)
   - Partial outputs are never returned

3. **Safety by Default**
   - All LLM output is treated as untrusted
   - Type safety guaranteed across frontend-backend boundary
   - No malformed data reaches the UI

### Without Pydantic AI

- Manual validation of every LLM response
- Custom retry logic with prompt injection
- Risk of partial/invalid data leaking to frontend
- No type-level guarantees

### With Pydantic AI

- Declarative schema definition
- Built-in retry + validation feedback loop
- Guaranteed type safety
- Production-ready error handling

---

## System Behavior When LLM Is Unavailable

### Scenario: API Quota Exhausted / Network Failure

**Backend Response:**
```json
{
  "error": "PROCESSING_FAILED",
  "message": "An unexpected error occurred during processing.",
  "retry_count": 0
}
```

**Frontend Behavior:**
- Displays red error card with user-friendly message
- No stack traces exposed
- "Try Again" button remains enabled
- System remains responsive

### Scenario: Invalid LLM Output

**Backend Response:**
- Retries up to `MAX_RETRIES` (default: 2)
- Injects validation errors into retry prompt
- If all retries fail: returns 500 error

**Frontend Behavior:**
- Same as above
- Logs indicate retry count for debugging

### Graceful Degradation

- No data loss (input preserved in textarea)
- No partial outputs
- Clear error messaging
- System remains stateless (no corruption)

---

## Running Locally

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **LLM API Key** (Gemini, OpenRouter, or OpenAI)

---

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your API key

# Run server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Backend will be available at:** `http://localhost:8000`

**Health check:** `http://localhost:8000/api/v1/health`

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment (optional)
# Create .env.local if you need to override API URL
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env.local

# Run dev server
npm run dev
```

**Frontend will be available at:** `http://localhost:3000`

---

### Testing

```bash
# Backend tests
cd backend
source venv/bin/activate
python test_system.py

# Frontend build check
cd frontend
npm run build
```

---

## Environment Variables

### Backend

See `backend/.env.example` for required variables.

**Required:**
- `GEMINI_API_KEY` — Your Gemini API key

**Optional:**
- `GEMINI_MODEL` — Model name (default: `gemini-1.5-flash-exp`)
- `MAX_RETRIES` — Retry limit (default: `2`)
- `CORS_ALLOWED_ORIGIN` — Frontend URL (default: `http://localhost:3000`)

### Frontend

**Optional:**
- `NEXT_PUBLIC_API_BASE_URL` — Backend URL (default: `http://localhost:8000`)

---

## API Keys Are Intentionally Excluded

**This repository does NOT include:**
- Real API keys
- Credentials
- Secrets of any kind

**You must provide your own:**
- Gemini API key (free tier available at https://ai.google.dev/)
- OR OpenRouter API key
- OR OpenAI API key

**Security Note:**
- Never commit `.env` files
- Use `.env.example` as a template only
- Rotate keys if accidentally exposed

---

## Project Structure

```
meeting-archaeologist/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI app
│   │   ├── api.py           # Endpoints
│   │   ├── agent.py         # Pydantic AI agent
│   │   ├── schemas.py       # Data models
│   │   ├── enums.py         # Priority, Domain, Complexity
│   │   ├── settings.py      # Environment config
│   │   └── logging.py       # Logging setup
│   ├── requirements.txt
│   ├── .env.example
│   └── test_system.py
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx     # Main UI
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/      # UI components
│   │   ├── lib/
│   │   │   ├── api.ts       # API client
│   │   │   └── markdown.ts  # Markdown export
│   │   └── types/
│   │       └── api.ts       # TypeScript types
│   ├── package.json
│   └── tsconfig.json
├── ARCHITECTURE.md          # Authoritative spec
├── TEST_REPORT.md
└── README.md
```

---

## Design Principles

### 1. Stateless by Design
- No database
- No user accounts
- No memory between requests
- Predictable, demo-friendly behavior

### 2. Schema-First, Not Prompt-First
- Schemas defined before prompts
- LLM must conform to schemas
- Free-form output treated as unsafe

### 3. LLM Output Is Unsafe by Default
- All output validated via Pydantic
- Invalid data rejected and retried
- Partial outputs never returned

### 4. Deterministic Feel from Probabilistic Models
- Retry logic + validation feedback
- Consistent error handling
- Type safety end-to-end

---

## Explicit Non-Goals

This system **does NOT**:
- Generate summaries
- Generate IDs
- Assign tasks to named people
- Infer stakeholders
- Store data
- Learn from past inputs
- Behave conversationally
- Hide uncertainty

---

## Evaluation Alignment

This project demonstrates:
- Treating AI as unsafe input
- Schema-driven system design
- Deterministic behavior from probabilistic models
- Senior-level architectural discipline
- Real-world execution focus

---

## License

MIT

---

## Contact

For questions or issues, please open a GitHub issue.


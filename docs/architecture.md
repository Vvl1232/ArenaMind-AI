# Architecture

## Overview
This document outlines the architecture of StadiumPilot-AI.

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: FastAPI (Python 3.11+) + Groq API
- **Deployment**: Vercel

## System Design

StadiumPilot AI follows a **Clean Architecture** approach:

```text
┌─────────────────────────────────────────────┐
│                  Frontend                    │
│         React 18 + Vite + Tailwind          │
├─────────────────────────────────────────────┤
│                  REST API                    │
│        FastAPI Routes (API Layer)           │
├─────────────────────────────────────────────┤
│               Services Layer                 │
│   Decision Engine │ Navigation │ Operations  │
│   Transport │ Accessibility │ Groq         │
├─────────────────────────────────────────────┤
│              Core / Prompts                  │
│     Config │ Prompt Templates │ Models       │
├─────────────────────────────────────────────┤
│                 Data Layer                   │
│     stadium.json │ crowd.json │ transport    │
└─────────────────────────────────────────────┘
```

### 1. API Layer (`app/api/`)
FastAPI controllers that define the REST endpoints. These controllers are kept thin; their only responsibilities are request validation (via Pydantic), invoking the appropriate service, and formatting the HTTP response.

### 2. Services Layer (`app/services/`)
Contains all business logic:
- `decision_engine.py`: Orchestrates the AI chat flow.
- `intent_router.py`: Classifies queries and handles fast factual responses.
- `groq_service.py`: Manages asynchronous communication with the Groq API.
- Domain services (`navigation_service.py`, `operations_service.py`, etc.): Handle logic for specific domains.

### 3. Data Layer (`app/data/`)
Currently implemented as static JSON files. Data is loaded and cached in-memory via `app/utils/helpers.py` using `lru_cache` to eliminate redundant disk I/O.

## Hybrid AI Architecture

To maximize performance and minimize token usage, the system uses a **Hybrid AI Architecture**:

1. **Intent Detection**: The `intent_router` analyzes incoming queries to determine their category (e.g., navigation, food, medical).
2. **Fast Factual Bypass**: If the query asks for simple, direct information (e.g., "Where is Gate A1?"), the system constructs an immediate Markdown response using the JSON data, completely bypassing the Groq API.
3. **Context Reduction**: If Groq is required (e.g., for complex reasoning or conversational queries), the `decision_engine` filters the dataset down to only the relevant parts based on the detected intent. This prevents injecting the entire 1,000+ line JSON database into every prompt.

## Error Handling & Validation

- Input validation is handled automatically by **Pydantic** models in `app/schemas/`.
- The `sanitize_input` utility strips potentially dangerous characters and neutralizes prompt injection attempts.
- All endpoints use `HTTPException` for standardized error reporting without leaking internal stack traces.

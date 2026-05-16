# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory. The user will chat with an AI chat in order to establish what document they want and how to fill in the fields. The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

> PL-5 shipped a frontend-only prototype (Next.js, no backend) supporting the Mutual NDA document with no AI chat. PL-6 added the full technical foundation. PL-7 replaced the static NDA form with an AI chat interface. PL-8 expanded support to all 12 document types in the catalog (see Implementation Status below).

## Development process

When instructed to build a feature:

1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

Use LiteLLM with `gpt-4o` via a direct OpenAI API key. The key is stored as `OPENAI_API_KEY` in the `.env` file in the project root. Use Structured Outputs (Pydantic response_format) so results can be parsed and used to populate fields in the legal document.

Note: the Cerebras skill in `.claude/skills/cerebras` documents an alternative routing path via OpenRouter. It requires an OpenRouter API key (not a plain OpenAI key) and will not work with the current `.env` setup.

## Technical design

The entire project should be packaged into a Docker container.  
The backend should be in backend/ and be a uv project, using FastAPI.  
The frontend should be in frontend/.  
The frontend is statically built (`output: "export"`, `trailingSlash: true`) and served by FastAPI via `StaticFiles`. The build output lands in `frontend/out/`.  
The database should use SQLite and be created from scratch each time the Docker container is brought up allowing for a user table with sign up and sign in.
There should be scripts in scripts/ for:  

```text
# Mac
scripts/start-mac.sh      # Start
scripts/stop-mac.sh       # Stop

# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1

Backend available at http://localhost:8000

## Implementation Status

### Done

**PL-5** - Mutual NDA Creator (frontend only, `feature/PL-5-mutual-nda-creator` - not yet merged to master)
- Next.js 16 app with two-column layout: form on left, live PDF preview on right
- `@react-pdf/renderer` for in-browser PDF generation and download
- Routes: `/login` (fake, client-side redirect) -> `/nda` (Mutual NDA Creator)

**PL-6** - V1 Foundation (`feature/PL-6-v1-foundation`, PR #5)
- FastAPI backend (`backend/`) as a uv project; entry point `main.py`
- SQLite database with `users` table, dropped and recreated fresh on every container start
- Frontend statically exported and served by FastAPI; `WORKDIR` in Docker is `/app/backend` so `Path(__file__).parent.parent / "frontend" / "out"` resolves correctly
- Dockerfile (multi-stage: Node 22 Alpine build -> Python 3.12 slim runtime)
- Start/stop scripts for Mac, Linux, Windows in `scripts/`

**PL-7** - AI Chat for Mutual NDA (`feature/PL-7-ai-chat`, merged)
- `POST /api/chat` endpoint in `backend/main.py`: accepts message history, calls LiteLLM (`gpt-4o`) with structured output `{message, fields}`, returns the AI reply and updated NDA field values
- `backend/` dependencies extended: `litellm`, `python-dotenv`; `uv.lock` updated
- New `NdaChat` component (`frontend/src/components/nda/NdaChat.tsx`): freeform chat UI, auto-fetches AI greeting on mount, merges field updates into live PDF preview after each AI turn
- `NdaPage` left column replaced: `NdaForm` removed, `NdaChat` added; PDF preview and download button pinned below chat
- Start scripts updated to pass `--env-file .env` to `docker run` so `OPENAI_API_KEY` reaches the container
- AI system prompt drives a guided conversation: acknowledges each value by name, asks about 1-3 unfilled fields per turn, never ends without a follow-up question, confirms completion when all fields are filled
- Textarea auto-focuses after each AI response (useEffect watching loading state)
- `min-h-0` on the NdaChat flex wrapper keeps the Download PDF button pinned at the bottom of the sidebar regardless of message count

**PL-8** - All document types (`feature/PL-8-all-document-types`, PR #7)
- Document registry in `backend/main.py`: field definitions for all 12 document types, `make_document_system_prompt()` generates per-type system prompts, `make_response_model()` creates Pydantic models dynamically via `create_model()`
- `POST /api/document-chat` endpoint: accepts `{document_type, messages}`, returns `{message, fields: dict[str, str]}`; existing `POST /api/chat` (NDA) is unchanged
- `frontend/src/config/documents.ts`: client-side document registry with slugs, field labels, and routing config (`useNdaRoute: true` for Mutual NDA routes to `/nda`, all others to `/documents/[slug]`)
- Catalog page at `/` (`frontend/src/app/page.tsx`): 3-column grid of all 12 document cards; login now redirects here instead of `/nda`
- Dynamic route `/documents/[slug]` with `generateStaticParams` covering all 11 non-NDA types; server component awaits `params` Promise (Next.js 16), delegates to `DocumentPageClient` client component
- `DocumentChat` component calls `/api/document-chat`; `GenericDocument.tsx` renders collected `Record<string, string>` fields as a live PDF key-value layout
- `frontend/src/types/document.ts`: `DocumentFields = Record<string, string>`
- The AI system prompt for each document type lists all field names and instructs the model to suggest the closest supported document if the user asks for an unsupported type

### Not yet started

- Real authentication (sign up / sign in backed by the users table)

## Color Scheme

- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`
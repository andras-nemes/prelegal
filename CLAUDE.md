# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory. The user will chat with an AI chat in order to establish what document they want and how to fill in the fields. The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

> PL-5 shipped a frontend-only prototype (Next.js, no backend) supporting the Mutual NDA document with no AI chat. PL-6 added the full technical foundation. PL-7 replaced the static NDA form with an AI chat interface (see Implementation Status below).

## Development process

When instructed to build a feature:

1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

When writing code to make calls to LLMs, use your Cerebras skill to use LiteLLM via OPENAI to the `GPT-5.4` model with Cerebras as the inference provider. You'll find my OPENAI API key in the .env file in the project root. You should use Structured Outputs so that you can interpret the results and populate fields in the legal document.

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

**PL-7** - AI Chat for Mutual NDA (`feature/PL-7-ai-chat`)
- `POST /api/chat` endpoint in `backend/main.py`: accepts message history, calls LiteLLM (`gpt-5.4` via Cerebras) with structured output `{message, fields}`, returns the AI reply and updated NDA field values
- `backend/` dependencies extended: `litellm`, `python-dotenv`; `uv.lock` updated
- New `NdaChat` component (`frontend/src/components/nda/NdaChat.tsx`): freeform chat UI, auto-fetches AI greeting on mount, merges field updates into live PDF preview after each AI turn
- `NdaPage` left column replaced: `NdaForm` removed, `NdaChat` added; PDF preview and download button unchanged
- Start scripts updated to pass `--env-file .env` to `docker run` so `OPENAI_API_KEY` reaches the container

### Not yet started

- Real authentication (sign up / sign in backed by the users table)
- Support for documents beyond the Mutual NDA

## Color Scheme

- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`
import sqlite3
from contextlib import asynccontextmanager
from datetime import date
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from litellm import completion
from pydantic import BaseModel, Field

load_dotenv()

DB_PATH = Path(__file__).parent / "prelegal.db"
FRONTEND_OUT = Path(__file__).parent.parent / "frontend" / "out"

MODEL = "gpt-4o"

SYSTEM_PROMPT = """\
You are a legal assistant helping a user create a Mutual Non-Disclosure Agreement (MNDA).

Collect the following information through friendly, conversational questions. Ask about one or two topics per turn. Keep replies concise.

Fields to collect:
- purpose: The business reason for sharing confidential information
- effectiveDate: Start date of the agreement (YYYY-MM-DD format, default to today: {today})
- mndaTermType: "expires" (fixed term) or "continuous" (until terminated)
- mndaTermYears: Duration in years (1-10), only relevant when mndaTermType is "expires"
- confidentialityTermType: "fixed" duration or "perpetual"
- confidentialityTermYears: Years info stays protected (1-10), only relevant when confidentialityTermType is "fixed"
- governingLaw: Governing state name (e.g. "Delaware")
- jurisdiction: Courts description (e.g. "courts located in New Castle, DE")
- party1Name, party1Title, party1Company, party1NoticeAddress: First party contact details
- party2Name, party2Title, party2Company, party2NoticeAddress: Second party contact details

In your response, always return all 16 fields. Carry forward values from earlier in the conversation. Use empty strings for string fields not yet known, 1 for unknown numeric fields, and sensible enum defaults.\
"""


def init_db() -> None:
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                email      TEXT    NOT NULL UNIQUE,
                password   TEXT    NOT NULL,
                created_at TEXT    NOT NULL DEFAULT (datetime('now'))
            )
            """
        )
        conn.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    DB_PATH.unlink(missing_ok=True)
    init_db()
    yield


app = FastAPI(lifespan=lifespan)


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class NdaFields(BaseModel):
    purpose: str
    effectiveDate: str
    mndaTermYears: int = Field(ge=1, le=10)
    mndaTermType: Literal["expires", "continuous"]
    confidentialityTermYears: int = Field(ge=1, le=10)
    confidentialityTermType: Literal["fixed", "perpetual"]
    governingLaw: str
    jurisdiction: str
    party1Name: str
    party1Title: str
    party1Company: str
    party1NoticeAddress: str
    party2Name: str
    party2Title: str
    party2Company: str
    party2NoticeAddress: str


class ChatResponse(BaseModel):
    message: str
    fields: NdaFields


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    system = SYSTEM_PROMPT.format(today=date.today().isoformat())
    messages = [{"role": "system", "content": system}]
    messages += [{"role": m.role, "content": m.content} for m in req.messages]
    if not req.messages:
        messages.append({"role": "user", "content": "Begin"})

    try:
        response = completion(
            model=MODEL,
            messages=messages,
            response_format=ChatResponse,
        )
        return ChatResponse.model_validate_json(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


app.mount("/", StaticFiles(directory=FRONTEND_OUT, html=True), name="static")

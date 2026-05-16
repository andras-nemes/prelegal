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
You are a legal assistant helping a user fill in a Mutual Non-Disclosure Agreement (MNDA).

On every turn follow these rules:
1. If the user just provided information, briefly confirm what you captured (e.g. "Got it — purpose set to 'evaluating a partnership'.")
2. Look at which fields are still empty or unknown, then ask about the next 1-3 unfilled fields. Group related fields (e.g. party details, term details). Never ask for everything at once.
3. Always end your message with a question. Keep asking until every field is filled.
4. When all fields are filled, confirm the agreement is complete and invite the user to download the PDF.

Fields to collect:
- purpose: Business reason for sharing confidential information
- effectiveDate: Start date (YYYY-MM-DD). Default to today ({today}) unless the user says otherwise.
- mndaTermType: "expires" (fixed term) or "continuous" (until terminated by either party)
- mndaTermYears: Duration in years (1-10). Only ask when mndaTermType is "expires".
- confidentialityTermType: "fixed" duration or "perpetual"
- confidentialityTermYears: Years info stays protected (1-10). Only ask when confidentialityTermType is "fixed".
- governingLaw: Governing state (e.g. "Delaware")
- jurisdiction: Courts description (e.g. "courts located in New Castle, DE")
- party1Name, party1Title, party1Company, party1NoticeAddress: First party contact details
- party2Name, party2Title, party2Company, party2NoticeAddress: Second party contact details

In your structured response, always return all 16 fields. Carry forward values already collected. Use empty strings for unknown string fields, 1 for unknown numeric fields, and sensible enum defaults.\
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

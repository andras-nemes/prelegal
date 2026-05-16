import sqlite3
from contextlib import asynccontextmanager
from datetime import date
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from litellm import completion
from pydantic import BaseModel, Field, create_model

load_dotenv()

DB_PATH = Path(__file__).parent / "prelegal.db"
FRONTEND_OUT = Path(__file__).parent.parent / "frontend" / "out"

MODEL = "gpt-4o"

# Field definitions: list of (field_name, human-readable description)
DOCUMENT_FIELDS: dict[str, list[tuple[str, str]]] = {
    "mutual-nda": [
        ("purpose", "Business reason for sharing confidential information"),
        ("effectiveDate", "Start date (YYYY-MM-DD). Default to today unless otherwise specified."),
        ("mndaTermType", '"expires" (fixed term) or "continuous" (until terminated by either party)'),
        ("mndaTermYears", "Duration in years (1-10). Only relevant when mndaTermType is 'expires'."),
        ("confidentialityTermType", '"fixed" duration or "perpetual"'),
        ("confidentialityTermYears", "Years info stays protected (1-10). Only relevant when confidentialityTermType is 'fixed'."),
        ("governingLaw", "Governing state (e.g. 'Delaware')"),
        ("jurisdiction", "Courts description (e.g. 'courts located in New Castle, DE')"),
        ("party1Name", "First party full name"),
        ("party1Title", "First party job title"),
        ("party1Company", "First party company name"),
        ("party1NoticeAddress", "First party notice address"),
        ("party2Name", "Second party full name"),
        ("party2Title", "Second party job title"),
        ("party2Company", "Second party company name"),
        ("party2NoticeAddress", "Second party notice address"),
    ],
    "mutual-nda-coverpage": [
        ("purpose", "Business reason for sharing confidential information"),
        ("effectiveDate", "Start date (YYYY-MM-DD). Default to today unless otherwise specified."),
        ("mndaTermType", '"expires" (fixed term) or "continuous" (until terminated by either party)'),
        ("mndaTermYears", "Duration in years (1-10). Only relevant when mndaTermType is 'expires'."),
        ("confidentialityTermType", '"fixed" duration or "perpetual"'),
        ("confidentialityTermYears", "Years info stays protected (1-10). Only relevant when confidentialityTermType is 'fixed'."),
        ("governingLaw", "Governing state (e.g. 'Delaware')"),
        ("jurisdiction", "Courts description (e.g. 'courts located in New Castle, DE')"),
        ("party1Name", "First party full name"),
        ("party1Title", "First party job title"),
        ("party1Company", "First party company name"),
        ("party1NoticeAddress", "First party notice address"),
        ("party2Name", "Second party full name"),
        ("party2Title", "Second party job title"),
        ("party2Company", "Second party company name"),
        ("party2NoticeAddress", "Second party notice address"),
    ],
    "csa": [
        ("customer", "Full legal name of the customer party"),
        ("provider", "Full legal name of the service provider"),
        ("subscriptionPeriod", "Duration of the subscription (e.g. '1 year from effective date')"),
        ("technicalSupport", "Level of technical support included (e.g. 'standard', 'premium')"),
        ("useLimitations", "Any specific limitations on permitted use of the service"),
        ("paymentProcess", "Payment terms and schedule (e.g. 'net 30, annual in advance')"),
        ("orderDate", "Date of the order (YYYY-MM-DD)"),
        ("nonRenewalNoticeDate", "Date by which either party must give notice of non-renewal (YYYY-MM-DD)"),
        ("effectiveDate", "Effective date of the agreement (YYYY-MM-DD). Default to today."),
        ("governingLaw", "State or jurisdiction governing the agreement"),
        ("chosenCourts", "Courts where disputes will be resolved"),
    ],
    "design-partner-agreement": [
        ("partner", "Full legal name of the design partner"),
        ("provider", "Full legal name of the provider/company"),
        ("term", "Duration of the design partner program (e.g. '6 months')"),
        ("program", "Name or description of the design partner program"),
        ("fees", "Fees owed by partner, if any (e.g. 'none' or a dollar amount)"),
        ("effectiveDate", "Effective date of the agreement (YYYY-MM-DD). Default to today."),
        ("governingLaw", "State or jurisdiction governing the agreement"),
        ("chosenCourts", "Courts where disputes will be resolved"),
        ("partnerNoticeAddress", "Partner's notice address"),
        ("providerNoticeAddress", "Provider's notice address"),
    ],
    "sla": [
        ("provider", "Full legal name of the service provider"),
        ("customer", "Full legal name of the customer"),
        ("targetUptime", "Target uptime percentage (e.g. '99.9%')"),
        ("subscriptionPeriod", "Subscription period covered by this SLA"),
        ("targetResponseTime", "Target support response time (e.g. '4 business hours')"),
        ("supportChannel", "How to reach support (e.g. 'support@provider.com or in-app ticket')"),
        ("uptimeCredit", "Service credit for missing uptime target (e.g. '10% of monthly fee')"),
        ("responseTimeCredit", "Service credit for missing response time target"),
        ("scheduledDowntime", "Scheduled maintenance windows excluded from uptime calculation"),
    ],
    "psa": [
        ("customer", "Full legal name of the customer"),
        ("provider", "Full legal name of the professional services provider"),
        ("effectiveDate", "Effective date of the agreement (YYYY-MM-DD). Default to today."),
        ("sowTerm", "Default term for each Statement of Work"),
        ("deliverables", "Description of the type of deliverables covered"),
        ("rejectionPeriod", "Days to reject a deliverable (e.g. '10 business days')"),
        ("fees", "Fee structure or rate (e.g. '$200/hour or fixed per SOW')"),
        ("paymentPeriod", "Payment terms (e.g. 'net 30')"),
        ("generalCapAmount", "General liability cap (e.g. 'fees paid in prior 12 months')"),
        ("increasedCapAmount", "Increased liability cap for specified claims"),
        ("providerCoveredClaims", "Provider indemnification claims"),
        ("customerCoveredClaims", "Customer indemnification claims"),
        ("insuranceMinimums", "Required insurance minimums"),
        ("governingLaw", "Governing state or jurisdiction"),
        ("chosenCourts", "Courts where disputes will be resolved"),
    ],
    "dpa": [
        ("customer", "Full legal name of the customer (Controller or Processor)"),
        ("provider", "Full legal name of the provider (Processor or Subprocessor)"),
        ("categoriesOfPersonalData", "Types of personal data being processed (e.g. 'name, email, IP address')"),
        ("categoriesOfDataSubjects", "Who the data subjects are (e.g. 'customer employees, end users')"),
        ("agreement", "Name or reference to the underlying services agreement this DPA is attached to"),
    ],
    "software-license-agreement": [
        ("customer", "Full legal name of the customer/licensee"),
        ("provider", "Full legal name of the software licensor"),
        ("subscriptionPeriod", "License term duration"),
        ("permittedUses", "How the customer is permitted to use the software"),
        ("orderDate", "Date of the order (YYYY-MM-DD)"),
        ("nonRenewalNoticeDate", "Notice date for non-renewal (YYYY-MM-DD)"),
        ("deletionProcedure", "How software and data must be deleted on termination"),
        ("warrantyPeriod", "Duration of the software warranty"),
        ("generalCapAmount", "General liability cap"),
        ("increasedCapAmount", "Increased liability cap for specified claims"),
        ("providerCoveredClaims", "Provider indemnification claims"),
        ("customerCoveredClaims", "Customer indemnification claims"),
        ("effectiveDate", "Effective date of the agreement (YYYY-MM-DD). Default to today."),
        ("governingLaw", "Governing state or jurisdiction"),
        ("chosenCourts", "Courts where disputes will be resolved"),
    ],
    "partnership-agreement": [
        ("company", "Full legal name of the company (Party 1)"),
        ("partner", "Full legal name of the partner (Party 2)"),
        ("companyObligations", "Company's key obligations under the partnership"),
        ("partnerObligations", "Partner's key obligations under the partnership"),
        ("paymentSchedule", "Payment schedule and amounts"),
        ("territory", "Geographic territory for trademark license"),
        ("brandGuidelines", "Reference to brand/trademark guidelines"),
        ("endDate", "Partnership end date (YYYY-MM-DD)"),
        ("generalCapAmount", "General liability cap"),
        ("increasedCapAmount", "Increased liability cap for specified claims"),
        ("companyCoveredClaim", "Company indemnification claims"),
        ("partnerCoveredClaims", "Partner indemnification claims"),
        ("governingLaw", "Governing state or jurisdiction"),
        ("chosenCourts", "Courts where disputes will be resolved"),
        ("effectiveDate", "Effective date of the agreement (YYYY-MM-DD). Default to today."),
    ],
    "pilot-agreement": [
        ("customer", "Full legal name of the customer"),
        ("provider", "Full legal name of the provider"),
        ("pilotPeriod", "Duration of the pilot evaluation (e.g. '90 days')"),
        ("effectiveDate", "Effective date of the agreement (YYYY-MM-DD). Default to today."),
        ("generalCapAmount", "General liability cap"),
        ("governingLaw", "Governing state or jurisdiction"),
        ("chosenCourts", "Courts where disputes will be resolved"),
    ],
    "baa": [
        ("provider", "Full legal name of the business associate (provider)"),
        ("company", "Full legal name of the covered entity (company)"),
        ("breachNotificationPeriod", "Days within which provider must notify company of a breach (e.g. '60 days')"),
        ("baaEffectiveDate", "Effective date of this BAA (YYYY-MM-DD). Default to today."),
        ("agreement", "Name or reference to the underlying services agreement this BAA is attached to"),
        ("limitations", "Any limitations on PHI use or disclosure beyond standard HIPAA requirements"),
    ],
    "ai-addendum": [
        ("customer", "Full legal name of the customer"),
        ("provider", "Full legal name of the provider"),
        ("trainingData", "Whether provider may use customer data to train AI models ('yes' or 'no')"),
        ("trainingPurposes", "Permitted purposes for AI model training, if allowed"),
        ("trainingRestrictions", "Restrictions on how customer input/output may be used for training"),
        ("improvementRestrictions", "Restrictions on using data for model improvement"),
    ],
}

SUPPORTED_DOCUMENTS = ", ".join(
    f'"{slug}"' for slug in DOCUMENT_FIELDS
)

NDA_SYSTEM_PROMPT = """\
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


def make_document_system_prompt(doc_slug: str, fields: list[tuple[str, str]]) -> str:
    doc_name = doc_slug.replace("-", " ").title()
    field_lines = "\n".join(f"- {name}: {desc}" for name, desc in fields)
    field_names = ", ".join(name for name, _ in fields)
    return f"""\
You are a legal assistant helping a user fill in a {doc_name}.

On every turn follow these rules:
1. If the user just provided information, briefly confirm what you captured.
2. Look at which fields are still empty or unknown, then ask about the next 1-3 unfilled fields. Group related fields. Never ask for everything at once.
3. Always end your message with a question. Keep asking until every field is filled.
4. When all fields are filled, confirm the agreement is complete and invite the user to download the PDF.
5. If the user asks for a document type you do not support, explain what you can help with and suggest the closest available document. Supported documents: {SUPPORTED_DOCUMENTS}.

Today's date is {{today}}.

Fields to collect:
{field_lines}

In your structured response, always return all fields ({field_names}). Carry forward values already collected. Use empty strings for fields not yet provided.\
"""


def make_response_model(field_names: list[str]):
    field_defs = {name: (str, "") for name in field_names}
    DocumentFields = create_model("DocumentFields", **field_defs)
    return create_model(
        "DocumentChatResponse",
        message=(str, ...),
        fields=(DocumentFields, ...),
    )


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


class DocumentChatRequest(BaseModel):
    document_type: str
    messages: list[ChatMessage]


class DocumentChatResponse(BaseModel):
    message: str
    fields: dict[str, str]


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    system = NDA_SYSTEM_PROMPT.format(today=date.today().isoformat())
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


@app.post("/api/document-chat", response_model=DocumentChatResponse)
def document_chat(req: DocumentChatRequest):
    field_defs = DOCUMENT_FIELDS.get(req.document_type)
    if not field_defs:
        raise HTTPException(status_code=400, detail=f"Unknown document type: {req.document_type}")

    today = date.today().isoformat()
    prompt_template = make_document_system_prompt(req.document_type, field_defs)
    system = prompt_template.format(today=today)

    messages = [{"role": "system", "content": system}]
    messages += [{"role": m.role, "content": m.content} for m in req.messages]
    if not req.messages:
        messages.append({"role": "user", "content": "Begin"})

    field_names = [name for name, _ in field_defs]
    ResponseModel = make_response_model(field_names)

    try:
        response = completion(
            model=MODEL,
            messages=messages,
            response_format=ResponseModel,
        )
        parsed = ResponseModel.model_validate_json(response.choices[0].message.content)
        return DocumentChatResponse(
            message=parsed.message,
            fields=dict(parsed.fields),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


app.mount("/", StaticFiles(directory=FRONTEND_OUT, html=True), name="static")

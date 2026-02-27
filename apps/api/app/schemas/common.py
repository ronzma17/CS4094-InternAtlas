from datetime import date, datetime
from pydantic import BaseModel, EmailStr, Field
from app.models.models import StageEnum


class AuthIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class ProfileIn(BaseModel):
    skills: list[str] = []
    interests: str = ""
    locations: list[str] = []
    grad_year: int | None = None


class ProfileOut(ProfileIn):
    pass


class OpportunityOut(BaseModel):
    id: int
    title: str
    org: str
    description: str
    location: str
    tags: list[str]
    deadline_date: date | None
    url: str | None
    match_score: float
    explanation: dict
    is_saved: bool = False


class AppIn(BaseModel):
    opportunity_id: int | None = None
    title_snapshot: str | None = None
    org_snapshot: str | None = None
    url_snapshot: str | None = None
    stage: StageEnum = StageEnum.Interested
    notes: str = ""
    deadline: date | None = None
    date_applied: date | None = None


class AppPatch(BaseModel):
    notes: str | None = None
    deadline: date | None = None
    date_applied: date | None = None


class StagePatch(BaseModel):
    stage: StageEnum


class RatingIn(BaseModel):
    rating: int = Field(ge=1, le=5)


class EventOut(BaseModel):
    id: int
    event_type: str
    created_at: datetime

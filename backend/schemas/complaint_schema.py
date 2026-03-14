from pydantic import BaseModel
from typing import Optional


class ComplaintCreate(BaseModel):
    raw_text: str
    category: str | None = None
    ward_name: str
    latitude: float
    longitude: float


class Complaint(BaseModel):
    id: int
    complaint_id: str
    raw_text: str
    predicted_category: str
    ai_urgency_score: float
    ward_name: str
    latitude: float
    longitude: float
    status: str
    filed_date: Optional[str] = None

    class Config:
        orm_mode = True
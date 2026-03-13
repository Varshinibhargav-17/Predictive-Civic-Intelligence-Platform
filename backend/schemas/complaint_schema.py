from pydantic import BaseModel


class Complaint(BaseModel):
    raw_text: str
    ward_name: str
    latitude: float
    longitude: float


class ComplaintResponse(BaseModel):
    raw_text: str
    predicted_category: str
    confidence: float
    ai_urgency_score: float
    ward_name: str
    latitude: float
    longitude: float
from fastapi import APIRouter
import pandas as pd
from backend.schemas.complaint_schema import Complaint
from backend.ml.classifier import classify_complaint
from backend.ml.urgency_scorer import score_urgency

router = APIRouter()

DATA_PATH = "backend/data/nagaraiq_complaints.csv"


# ----------------------------
# GET COMPLAINTS
# ----------------------------
@router.get("/complaints")
def get_complaints():

    df = pd.read_csv(DATA_PATH)

    df = df.replace([float("inf"), float("-inf")], None)
    df = df.fillna("")

    return df.head(50).to_dict(orient="records")


# ----------------------------
# CREATE COMPLAINT
# ----------------------------
@router.post("/complaints")
def create_complaint(complaint: Complaint):

    df = pd.read_csv(DATA_PATH)

    # run ML classifier
    result = classify_complaint(complaint.raw_text)

    category = result["category"]
    confidence = result["confidence"]

    # urgency score
    urgency = score_urgency(category)

    new_row = {
        "raw_text": complaint.raw_text,
        "predicted_category": category,
        "confidence": confidence,
        "ai_urgency_score": urgency,
        "ward_name": complaint.ward_name,
        "latitude": complaint.latitude,
        "longitude": complaint.longitude,
    }

    df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)

    df.to_csv(DATA_PATH, index=False)

    return {"message": "Complaint stored successfully", "data": new_row}
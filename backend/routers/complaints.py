from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.models.complaint import Complaint as ComplaintModel
from backend.schemas.complaint_schema import ComplaintCreate, Complaint as ComplaintSchema

from backend.ml.classifier import classify_complaint
from backend.ml.urgency_scorer import score_urgency

router = APIRouter()

@router.get("/complaints", response_model=List[ComplaintSchema])
def get_complaints(db: Session = Depends(get_db)):
    db_complaints = db.query(ComplaintModel).order_by(ComplaintModel.id.desc()).all()
    # map model to schema since fields slightly differ
    results = []
    for c in db_complaints:
        results.append(ComplaintSchema(
            id=c.id,
            complaint_id=f"CMP-{c.id:04d}",
            raw_text=c.raw_text or "",
            predicted_category=c.category or "Other",
            ai_urgency_score=c.urgency_score or 0,
            ward_name=c.ward_name or "Unknown",
            latitude=c.latitude or 0.0,
            longitude=c.longitude or 0.0,
            status=c.status or "open",
            filed_date=c.created_at.isoformat() if c.created_at else None
        ))
    return results

@router.post("/complaints", response_model=ComplaintSchema)
def create_complaint(complaint: ComplaintCreate, db: Session = Depends(get_db)):
    if complaint.category and complaint.category != "Unknown":
        category = complaint.category
    else:
        classification = classify_complaint(complaint.raw_text)
        category = classification.get("category", "Other")
    
    # score urgency using ML
    urgency = score_urgency(complaint.raw_text, category)
    
    db_complaint = ComplaintModel(
        raw_text=complaint.raw_text,
        category=category,
        urgency_score=urgency,
        ward_name=complaint.ward_name,
        latitude=complaint.latitude,
        longitude=complaint.longitude,
        status="open"
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    
    return ComplaintSchema(
        id=db_complaint.id,
        complaint_id=f"CMP-{db_complaint.id:04d}",
        raw_text=db_complaint.raw_text or "",
        predicted_category=db_complaint.category or "Other",
        ai_urgency_score=db_complaint.urgency_score or 0,
        ward_name=db_complaint.ward_name or "Unknown",
        latitude=db_complaint.latitude or 0.0,
        longitude=db_complaint.longitude or 0.0,
        status=db_complaint.status or "open",
        filed_date=db_complaint.created_at.isoformat() if db_complaint.created_at else None
    )

@router.put("/complaints/{complaint_id}", response_model=ComplaintSchema)
def update_complaint_status(complaint_id: int, status: str, db: Session = Depends(get_db)):
    db_complaint = db.query(ComplaintModel).filter(ComplaintModel.id == complaint_id).first()
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    db_complaint.status = status
    db.commit()
    db.refresh(db_complaint)
    
    return ComplaintSchema(
        id=db_complaint.id,
        complaint_id=f"CMP-{db_complaint.id:04d}",
        raw_text=db_complaint.raw_text or "",
        predicted_category=db_complaint.category or "Other",
        ai_urgency_score=db_complaint.urgency_score or 0,
        ward_name=db_complaint.ward_name or "Unknown",
        latitude=db_complaint.latitude or 0.0,
        longitude=db_complaint.longitude or 0.0,
        status=db_complaint.status or "open",
        filed_date=db_complaint.created_at.isoformat() if db_complaint.created_at else None
    )
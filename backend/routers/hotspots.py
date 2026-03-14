from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.database import SessionLocal
from backend.models.complaint import Complaint as ComplaintModel

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Approximate ward centroids for Bengaluru's most common ward names
WARD_COORDS: dict[str, tuple[float, float]] = {
    "BTM Layout":       (12.9166, 77.6101),
    "Koramangala":      (12.9352, 77.6245),
    "Indiranagar":      (12.9784, 77.6408),
    "Whitefield":       (12.9698, 77.7500),
    "Marathahalli":     (12.9591, 77.7009),
    "Bellandur":        (12.9256, 77.6700),
    "HSR Layout":       (12.9116, 77.6389),
    "Rajajinagar":      (12.9927, 77.5534),
    "Malleshwaram":     (13.0035, 77.5710),
    "Jayanagar":        (12.9308, 77.5838),
    "Shivajinagar":     (12.9857, 77.6009),
    "Hebbal":           (13.0351, 77.5970),
    "Yelahanka":        (13.1005, 77.5963),
    "JP Nagar":         (12.9102, 77.5835),
    "Bommanahalli":     (12.8953, 77.6310),
    "Electronic City":  (12.8399, 77.6770),
    "Banashankari":     (12.9256, 77.5468),
    "Vijayanagar":      (12.9716, 77.5358),
    "Yeshwanthpur":     (13.0290, 77.5485),
    "Ulsoor":           (12.9822, 77.6218),
}


@router.get("/hotspots")
def get_hotspots_data(db: Session = Depends(get_db)):
    """
    Return wards with highest complaint density as hotspots, with lat/lng for map markers.
    Cluster 1 = High (top 20%), Cluster 2 = Moderate (next 30%), Cluster 3 = Normal.
    """
    rows = (
        db.query(
            ComplaintModel.ward_name,
            func.count(ComplaintModel.id).label("complaint_count"),
            func.avg(ComplaintModel.latitude).label("avg_lat"),
            func.avg(ComplaintModel.longitude).label("avg_lng"),
        )
        .group_by(ComplaintModel.ward_name)
        .order_by(func.count(ComplaintModel.id).desc())
        .limit(50)
        .all()
    )

    if not rows:
        return []

    total = len(rows)
    result = []
    for idx, r in enumerate(rows):
        pct = (idx + 1) / total
        cluster_id = 1 if pct <= 0.20 else (2 if pct <= 0.50 else 3)

        # Use known coordinates first; fall back to average from complaint records
        coords = WARD_COORDS.get(r.ward_name or "")
        lat = coords[0] if coords else (float(r.avg_lat) if r.avg_lat else 12.9716)
        lng = coords[1] if coords else (float(r.avg_lng) if r.avg_lng else 77.5946)

        result.append({
            "ward_name":       r.ward_name or "Unknown",
            "ward_id":         hash(r.ward_name) % 200 + 1,
            "cluster_id":      cluster_id,
            "complaint_count": r.complaint_count,
            "lat":             lat,
            "lng":             lng,
        })

    return result
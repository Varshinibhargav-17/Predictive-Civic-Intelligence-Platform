# backend/schemas/image_schema.py

from pydantic import BaseModel, Field


class ImageClassificationResult(BaseModel):
    """
    Response schema for POST /classify-image
    """

    predicted_category: str = Field(
        ...,
        description="Predicted civic complaint category from CLIP classification.",
        examples=["Road & Potholes", "Sanitation & Garbage", "Drainage", "Unknown"]
    )

    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Model confidence score between 0.0 and 1.0. "
                    "Scores below 0.20 trigger manual confirmation.",
        examples=[0.74, 0.15]
    )

    needs_manual_confirmation: bool = Field(
        ...,
        description="True if confidence is below threshold (0.20). "
                    "Frontend should show a manual category selector when True.",
        examples=[False, True]
    )

    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "summary": "Successful classification",
                    "value": {
                        "predicted_category": "Road & Potholes",
                        "confidence": 0.74,
                        "needs_manual_confirmation": False
                    }
                },
                {
                    "summary": "Low confidence — needs manual input",
                    "value": {
                        "predicted_category": "Unknown",
                        "confidence": 0.15,
                        "needs_manual_confirmation": True
                    }
                }
            ]
        }
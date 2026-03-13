# backend/routers/image.py

from fastapi import APIRouter, File, UploadFile
from backend.schemas.image_schema import ImageClassificationResult
from backend.services.image_service import process_image_upload

router = APIRouter(
    prefix="",
    tags=["Image Classification"]
)


@router.post(
    "/classify-image",
    response_model=ImageClassificationResult,
    summary="Classify a civic complaint image using CLIP",
    description="""
Upload a photo of a civic issue (pothole, garbage, broken streetlight, etc.)
and get an AI-predicted complaint category.

Uses OpenAI CLIP zero-shot classification — no training required.

If the model confidence is below 0.20 (blurry/dark/unclear image),
`needs_manual_confirmation` will be `true` and the frontend should
show a manual category dropdown to the citizen.
    """
)
async def classify_complaint_image(
    file: UploadFile = File(
        ...,
        description="Image file of the civic issue (JPEG, PNG, WebP). Max 10MB."
    )
):
    """
    POST /classify-image

    Accepts a multipart image upload.
    Returns predicted civic complaint category and confidence score.
    """
    result = await process_image_upload(file)

    return ImageClassificationResult(
        predicted_category=result["predicted_category"],
        confidence=result["confidence"],
        needs_manual_confirmation=result["needs_manual_confirmation"]
    )
# backend/services/image_service.py

from fastapi import UploadFile, HTTPException
from backend.ml.image_classifier import classify_image

# Max allowed image size: 10MB
MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024

# Allowed MIME types
ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/heic",
}


async def process_image_upload(file: UploadFile) -> dict:
    """
    Validates the uploaded file and runs CLIP classification.

    Args:
        file: FastAPI UploadFile from multipart form

    Returns:
        dict with predicted_category, confidence, needs_manual_confirmation

    Raises:
        HTTPException 400 if file is invalid
        HTTPException 415 if file type not supported
        HTTPException 413 if file too large
    """

    # ── Validation 1: File must be present ────────────────────────────────────
    if not file or not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file uploaded. Please attach an image file."
        )

    # ── Validation 2: Must be an image ────────────────────────────────────────
    content_type = file.content_type or ""
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type: '{content_type}'. "
                   f"Please upload a JPEG, PNG, or WebP image."
        )

    # ── Read file bytes ────────────────────────────────────────────────────────
    image_bytes = await file.read()

    # ── Validation 3: File size check ─────────────────────────────────────────
    if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Image too large ({len(image_bytes) // (1024*1024)}MB). "
                   f"Maximum allowed size is 10MB."
        )

    # ── Validation 4: Must have actual content ────────────────────────────────
    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
        )

    # ── Run CLIP classification ────────────────────────────────────────────────
    result = classify_image(image_bytes)

    return result
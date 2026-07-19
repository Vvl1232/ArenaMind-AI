"""
StadiumPilot AI — Accessibility API Router.

Handles accessibility assistance endpoints.
"""

from fastapi import APIRouter, HTTPException

from app.schemas.request import AccessibilityRequest
from app.schemas.response import AccessibilityResponse, ErrorResponse
from app.services.accessibility_service import get_accessibility_info
from app.utils.logger import logger

router = APIRouter(prefix="/api", tags=["Accessibility"])


@router.post(
    "/accessibility",
    response_model=AccessibilityResponse,
    responses={500: {"model": ErrorResponse}},
    summary="Get accessibility assistance",
    description="Ask about accessible facilities, routes, and services.",
)
async def accessibility(request: AccessibilityRequest) -> AccessibilityResponse:
    """Get AI-powered accessibility guidance."""
    try:
        response_text = await get_accessibility_info(query=request.query)
        return AccessibilityResponse(response=response_text)
    except Exception as e:
        logger.error("Accessibility endpoint error: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))

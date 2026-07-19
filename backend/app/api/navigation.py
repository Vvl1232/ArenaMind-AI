"""
StadiumPilot AI — Navigation API Router.

Handles navigation and wayfinding endpoints.
"""

from fastapi import APIRouter, HTTPException

from app.schemas.request import NavigationRequest
from app.schemas.response import ErrorResponse, NavigationResponse
from app.services.navigation_service import get_navigation
from app.utils.logger import logger

router = APIRouter(prefix="/api", tags=["Navigation"])


@router.post(
    "/navigate",
    response_model=NavigationResponse,
    responses={500: {"model": ErrorResponse}},
    summary="Get navigation directions",
    description="Get AI-powered step-by-step navigation between two stadium locations.",
)
async def navigate(request: NavigationRequest) -> NavigationResponse:
    """Get navigation instructions between two locations."""
    try:
        response_text = await get_navigation(
            origin=request.origin,
            destination=request.destination,
            accessible=request.accessible,
        )
        return NavigationResponse(
            response=response_text,
            origin=request.origin,
            destination=request.destination,
            accessible=request.accessible,
        )
    except Exception as e:
        logger.error("Navigation endpoint error: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))

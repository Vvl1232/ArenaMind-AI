"""
StadiumPilot AI — Operations API Router.

Handles operational copilot endpoints for organizers and staff.
"""

from fastapi import APIRouter, HTTPException

from app.schemas.request import OperationsRequest
from app.schemas.response import ErrorResponse, OperationsResponse
from app.services.operations_service import get_operations_recommendation
from app.utils.logger import logger

router = APIRouter(prefix="/api", tags=["Operations"])


@router.post(
    "/operations",
    response_model=OperationsResponse,
    responses={500: {"model": ErrorResponse}},
    summary="Get operational recommendations",
    description="Submit an operational scenario and receive AI-powered recommendations.",
)
async def operations(request: OperationsRequest) -> OperationsResponse:
    """Get operational recommendations for a scenario."""
    try:
        response_text = await get_operations_recommendation(
            scenario=request.scenario,
            priority=request.priority,
            zone=request.zone,
        )
        return OperationsResponse(
            response=response_text,
            priority=request.priority,
            zone=request.zone,
        )
    except Exception as e:
        logger.error("Operations endpoint error: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))

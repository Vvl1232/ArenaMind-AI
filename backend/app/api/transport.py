"""
StadiumPilot AI — Transport API Router.

Handles transport information and guidance endpoints.
"""

from fastapi import APIRouter, HTTPException, Response

from app.schemas.request import TransportRequest
from app.schemas.response import ErrorResponse, TransportResponse
from app.services.transport_service import get_transport_info
from app.utils.helpers import get_transport_data
from app.utils.logger import logger

router = APIRouter(prefix="/api", tags=["Transport"])


@router.get(
    "/transport",
    summary="Get transport data",
    description="Retrieve current transport availability and status.",
)
async def get_transport(response: Response) -> dict:
    """Return the current transport data."""
    try:
        response.headers["Cache-Control"] = "public, max-age=300"
        data = get_transport_data()
        return data
    except Exception as e:
        logger.error("Transport data endpoint error: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.post(
    "/transport/ask",
    response_model=TransportResponse,
    responses={500: {"model": ErrorResponse}},
    summary="Ask about transport",
    description="Ask an AI-powered question about transport options.",
)
async def ask_transport(request: TransportRequest) -> TransportResponse:
    """Get AI-powered transport guidance."""
    try:
        response_text = await get_transport_info(query=request.query)
        return TransportResponse(response=response_text)
    except Exception as e:
        logger.error("Transport ask endpoint error: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))

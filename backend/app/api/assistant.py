"""
StadiumPilot AI — Assistant API Router.

Handles the main AI chat endpoint.
"""

from app.schemas.request import ChatRequest
from app.schemas.response import ChatResponse, ErrorResponse
from app.services.decision_engine import process_chat
from app.utils.logger import logger
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api", tags=["Assistant"])


@router.post(
    "/chat",
    response_model=ChatResponse,
    responses={500: {"model": ErrorResponse}},
    summary="Chat with StadiumPilot AI",
    description="Send a question and receive an AI-powered response with stadium context.",
)
async def chat(request: ChatRequest) -> ChatResponse:
    """Process a chat message through the AI assistant."""
    try:
        response_text, language = await process_chat(
            message=request.message,
            language=request.language,
            context=request.context,
        )
        return ChatResponse(
            response=response_text,
            language=language,
            mode="assistant",
        )
    except Exception as e:
        logger.error("Chat endpoint error: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))

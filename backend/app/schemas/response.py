"""
StadiumPilot AI — Response Schemas.
"""

from pydantic import BaseModel, Field


class ChatResponse(BaseModel):
    """Schema for AI assistant chat response."""

    response: str = Field(..., description="AI-generated response")
    language: str = Field(default="en", description="Detected / used language")
    mode: str = Field(default="assistant", description="Response mode")


class NavigationResponse(BaseModel):
    """Schema for navigation response."""

    response: str = Field(..., description="Navigation instructions")
    origin: str = Field(..., description="Origin location")
    destination: str = Field(..., description="Destination location")
    accessible: bool = Field(
        default=False, description="Whether accessible route was used"
    )


class OperationsResponse(BaseModel):
    """Schema for operations copilot response."""

    response: str = Field(..., description="Operational recommendations")
    priority: str = Field(default="medium", description="Priority level")
    zone: str | None = Field(default=None, description="Focus zone")


class TransportResponse(BaseModel):
    """Schema for transport response."""

    response: str = Field(..., description="Transport information and recommendations")


class AccessibilityResponse(BaseModel):
    """Schema for accessibility response."""

    response: str = Field(..., description="Accessibility information and guidance")


class HealthResponse(BaseModel):
    """Schema for health check response."""

    status: str = Field(default="healthy")
    version: str = Field(default="1.0.0")
    service: str = Field(default="StadiumPilot AI")


class ErrorResponse(BaseModel):
    """Schema for error responses."""

    error: str = Field(..., description="Error message")
    detail: str | None = Field(default=None, description="Detailed error information")

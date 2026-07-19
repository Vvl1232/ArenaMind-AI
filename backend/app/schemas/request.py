"""
StadiumPilot AI — Request Schemas.
"""

from typing import Literal

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Schema for the AI assistant chat endpoint."""

    message: str = Field(
        ..., min_length=1, max_length=2000, description="User's question or message"
    )
    language: str | None = Field(
        default=None,
        description="Preferred response language (auto-detected if not provided)",
    )
    context: str | None = Field(
        default=None, description="Additional context for the query"
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {"message": "Where is Gate B12?", "language": None, "context": None}
            ]
        }
    }


class NavigationRequest(BaseModel):
    """Schema for the navigation endpoint."""

    origin: str = Field(
        ..., min_length=1, max_length=200, description="Starting location"
    )
    destination: str = Field(
        ..., min_length=1, max_length=200, description="Target destination"
    )
    accessible: bool = Field(
        default=False, description="Whether an accessible route is required"
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "origin": "Gate A1",
                    "destination": "Restroom A-North",
                    "accessible": False,
                }
            ]
        }
    }


class OperationsRequest(BaseModel):
    """Schema for the operations copilot endpoint."""

    scenario: str = Field(
        ...,
        min_length=1,
        max_length=3000,
        description="Operational scenario description",
    )
    priority: Literal["low", "medium", "high", "critical"] = Field(
        default="medium", description="Priority level: low, medium, high, critical"
    )
    zone: str | None = Field(default=None, description="Specific zone to focus on")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "scenario": "Gate A1 is at 88% capacity with 14-minute wait times.",
                    "priority": "high",
                    "zone": "North",
                }
            ]
        }
    }


class TransportRequest(BaseModel):
    """Schema for the transport endpoint."""

    query: str = Field(
        ..., min_length=1, max_length=1000, description="Transport-related question"
    )

    model_config = {
        "json_schema_extra": {
            "examples": [{"query": "When is the next metro to Manhattan?"}]
        }
    }


class AccessibilityRequest(BaseModel):
    """Schema for the accessibility endpoint."""

    query: str = Field(
        ..., min_length=1, max_length=1000, description="Accessibility-related question"
    )

    model_config = {
        "json_schema_extra": {
            "examples": [{"query": "Where are the wheelchair-accessible restrooms?"}]
        }
    }

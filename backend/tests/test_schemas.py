"""
StadiumPilot AI — Schema Validation Tests.
"""

import pytest
from app.schemas.request import ChatRequest, OperationsRequest
from pydantic import ValidationError


def test_chat_request_validation():
    # Valid
    req = ChatRequest(message="Hello")
    assert req.message == "Hello"

    # Invalid (empty message)
    with pytest.raises(ValidationError):
        ChatRequest(message="")


def test_operations_request_validation():
    # Valid
    req = OperationsRequest(scenario="Crowd issue", priority="high")
    assert req.priority == "high"

    # Invalid (wrong priority)
    with pytest.raises(ValidationError):
        OperationsRequest(scenario="Crowd issue", priority="urgent")

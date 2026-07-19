"""
StadiumPilot AI — Security Tests.
"""

from fastapi.testclient import TestClient


def test_cors_headers(client: TestClient):
    """Test that CORS headers are appropriately restricted."""
    # OPTIONS request to test CORS
    response = client.options(
        "/api/chat",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
        },
    )

    assert response.status_code == 200
    # Ensure allowed methods are restricted
    allowed_methods = response.headers.get("access-control-allow-methods", "")
    assert "POST" in allowed_methods
    assert "DELETE" not in allowed_methods
    assert "PUT" not in allowed_methods


def test_error_leakage(client: TestClient):
    """Ensure internal errors do not leak stack traces."""
    # Send malformed JSON to trigger a validation error
    response = client.post(
        "/api/chat",
        content="this is not json",
        headers={"Content-Type": "application/json"},
    )
    assert response.status_code == 422
    # Ensure no traceback is in the response
    assert "Traceback" not in response.text

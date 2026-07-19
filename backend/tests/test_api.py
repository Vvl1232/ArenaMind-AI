"""
StadiumPilot AI — API Tests.
"""

from unittest.mock import patch

from fastapi.testclient import TestClient

# Don't need to import mock_stadium_data explicitly if passed as arguments from conftest


def test_health_check(client: TestClient):
    """Test the health check endpoint."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert "version" in response.json()


def test_get_stadium(client: TestClient, mock_stadium_data):
    """Test getting stadium data."""
    response = client.get("/api/stadium")
    assert response.status_code == 200
    assert "gates" in response.json()
    assert response.json()["gates"][0]["name"] == "Gate A1"


def test_get_crowd(client: TestClient, mock_crowd_data):
    """Test getting crowd data."""
    response = client.get("/api/crowd")
    assert response.status_code == 200
    assert "zones" in response.json()
    assert response.json()["zones"][0]["name"] == "North Stand"


def test_get_transport(client: TestClient, mock_transport_data):
    """Test getting transport data."""
    response = client.get("/api/transport")
    assert response.status_code == 200
    assert "metro" in response.json()


def test_chat_endpoint_mocked(client: TestClient, mock_groq):
    """Test the chat endpoint with mocked Groq response."""
    response = client.post("/api/chat", json={"message": "Hello AI"})
    assert response.status_code == 200
    data = response.json()
    assert data["response"] == "This is a mocked AI response."


def test_chat_endpoint_fast_factual(client: TestClient, mock_stadium_data):
    """Test the chat endpoint triggering a fast factual response (no mock_groq needed)."""
    response = client.post("/api/chat", json={"message": "Where is Gate A1?"})
    assert response.status_code == 200
    data = response.json()
    assert "Gate A1" in data["response"]
    assert "North Zone" in data["response"]


def test_navigate_endpoint(client: TestClient, mock_stadium_data, mock_groq):
    """Test navigation endpoint."""
    response = client.post(
        "/api/navigate", json={"origin": "Gate A1", "destination": "Food"}
    )
    assert response.status_code == 200
    assert response.json()["response"] == "This is a mocked AI response."


def test_navigate_endpoint_fast_factual(client: TestClient, mock_stadium_data):
    """Test navigation endpoint fast factual path."""
    response = client.post(
        "/api/navigate",
        json={"origin": "Gate A1", "destination": "Restroom North", "accessible": True},
    )
    assert response.status_code == 200
    assert "Route: Route 1" in response.json()["response"]


def test_operations_endpoint(client: TestClient, mock_groq):
    """Test operations endpoint."""
    response = client.post(
        "/api/operations",
        json={"scenario": "Crowd issue", "priority": "high", "zone": "North"},
    )
    assert response.status_code == 200
    assert response.json()["response"] == "This is a mocked AI response."


def test_ask_transport_endpoint(client: TestClient, mock_groq):
    """Test transport ask endpoint."""
    response = client.post(
        "/api/transport/ask", json={"query": "How to get to airport?"}
    )
    assert response.status_code == 200
    assert response.json()["response"] == "This is a mocked AI response."


def test_accessibility_endpoint(client: TestClient, mock_groq):
    """Test accessibility endpoint."""
    response = client.post("/api/accessibility", json={"query": "Wheelchair help"})
    assert response.status_code == 200
    assert response.json()["response"] == "This is a mocked AI response."


def test_get_stadium_file_not_found(client: TestClient):
    with patch("app.main.get_stadium_data", side_effect=FileNotFoundError):
        response = client.get("/api/stadium")
        assert response.status_code == 500
        assert "unavailable" in response.json()["detail"]


def test_get_stadium_exception(client: TestClient):
    with patch("app.main.get_stadium_data", side_effect=Exception("Database down")):
        response = client.get("/api/stadium")
        assert response.status_code == 500
        assert "Failed" in response.json()["detail"]


def test_get_crowd_file_not_found(client: TestClient):
    with patch("app.main.get_crowd_data", side_effect=FileNotFoundError):
        response = client.get("/api/crowd")
        assert response.status_code == 500
        assert "unavailable" in response.json()["detail"]


def test_get_crowd_exception(client: TestClient):
    with patch("app.main.get_crowd_data", side_effect=Exception("Database down")):
        response = client.get("/api/crowd")
        assert response.status_code == 500
        assert "Failed" in response.json()["detail"]


def test_chat_endpoint_exception(client: TestClient, mock_stadium_data):
    with patch("app.api.assistant.process_chat", side_effect=Exception("API failure")):
        response = client.post("/api/chat", json={"message": "Hello"})
        assert response.status_code == 500
        assert "API failure" in response.json()["detail"]


def test_navigate_endpoint_exception(client: TestClient, mock_stadium_data):
    with patch(
        "app.api.navigation.get_navigation", side_effect=Exception("API failure")
    ):
        response = client.post(
            "/api/navigate", json={"origin": "A", "destination": "B"}
        )
        assert response.status_code == 500
        assert "API failure" in response.json()["detail"]


def test_operations_endpoint_exception(client: TestClient, mock_stadium_data):
    with patch(
        "app.api.operations.get_operations_recommendation",
        side_effect=Exception("API failure"),
    ):
        response = client.post(
            "/api/operations", json={"scenario": "A", "priority": "high"}
        )
        assert response.status_code == 500
        assert "API failure" in response.json()["detail"]


def test_transport_endpoint_exception(client: TestClient, mock_stadium_data):
    with patch(
        "app.api.transport.get_transport_info", side_effect=Exception("API failure")
    ):
        response = client.post("/api/transport/ask", json={"query": "A"})
        assert response.status_code == 500
        assert "API failure" in response.json()["detail"]


def test_get_transport_data_exception(client: TestClient):
    with patch(
        "app.api.transport.get_transport_data", side_effect=Exception("API failure")
    ):
        response = client.get("/api/transport")
        assert response.status_code == 500
        assert "API failure" in response.json()["detail"]


def test_get_transport_data_file_not_found(client: TestClient):
    with patch("app.api.transport.get_transport_data", side_effect=FileNotFoundError):
        response = client.get("/api/transport")
        assert response.status_code == 500
        assert response.json()["detail"] == ""


def test_accessibility_endpoint_exception(client: TestClient, mock_stadium_data):
    with patch(
        "app.api.accessibility.get_accessibility_info",
        side_effect=Exception("API failure"),
    ):
        response = client.post("/api/accessibility", json={"query": "A"})
        assert response.status_code == 500
        assert "API failure" in response.json()["detail"]

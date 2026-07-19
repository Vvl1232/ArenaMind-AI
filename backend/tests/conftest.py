"""
StadiumPilot AI — Pytest Fixtures.
"""

from unittest.mock import AsyncMock, patch

import pytest
from app.main import app
from app.utils.helpers import clear_data_cache
from fastapi.testclient import TestClient


@pytest.fixture
def client():
    """Test client for FastAPI."""
    return TestClient(app)


@pytest.fixture(autouse=True)
def reset_cache():
    """Clear data cache before each test to ensure isolation."""
    clear_data_cache()
    yield
    clear_data_cache()


@pytest.fixture
def mock_groq():
    """Mock Groq API response."""
    with patch(
        "app.services.groq_service.generate_response", new_callable=AsyncMock
    ) as mock:
        mock.return_value = "This is a mocked AI response."
        yield mock


@pytest.fixture
def mock_all_data():
    stadium = {
        "gates": [
            {
                "id": "g1",
                "name": "Gate A1",
                "zone": "North",
                "floor": 1,
                "status": "open",
                "wait_time_min": 5,
                "accessible": True,
            }
        ],
        "restrooms": [
            {
                "id": "r1",
                "name": "Restroom North",
                "zone": "North",
                "floor": 1,
                "accessible": True,
            }
        ],
        "food_courts": [
            {
                "id": "f1",
                "name": "Pizza Stand",
                "zone": "North",
                "floor": 1,
                "cuisine": "Italian",
                "wait_time_min": 10,
            }
        ],
        "walking_routes": [
            {
                "id": "w1",
                "name": "Route 1",
                "from": "Gate A1",
                "to": "Restroom North",
                "distance_km": 0.1,
                "time_min": 2,
                "accessible": True,
            }
        ],
        "medical": [
            {
                "id": "m1",
                "name": "Medical North",
                "zone": "North",
                "floor": 1,
                "services": ["First Aid"],
            }
        ],
    }
    crowd = {
        "zones": [
            {"name": "North Stand", "occupancy_percent": 80, "risk_level": "moderate"}
        ]
    }
    transport = {
        "metro": [
            {
                "line": "Red Line",
                "station": "Stadium North",
                "next_departures": ["5 mins"],
                "walk_time_min": 5,
            }
        ]
    }

    def side_effect(path):
        if "stadium" in path:
            return stadium
        if "crowd" in path:
            return crowd
        if "transport" in path:
            return transport
        return {}

    with patch("app.utils.helpers._load_json_cached", side_effect=side_effect):
        yield {"stadium": stadium, "crowd": crowd, "transport": transport}


@pytest.fixture
def mock_stadium_data(mock_all_data):
    return mock_all_data["stadium"]


@pytest.fixture
def mock_crowd_data(mock_all_data):
    return mock_all_data["crowd"]


@pytest.fixture
def mock_transport_data(mock_all_data):
    return mock_all_data["transport"]

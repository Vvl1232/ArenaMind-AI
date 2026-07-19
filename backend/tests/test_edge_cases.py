
import pytest
from app.core.config import Settings
from app.main import app
from fastapi.testclient import TestClient


def test_global_exception_handler():
    # Force an unhandled exception
    @app.get("/api/force-error")
    def force_error():
        raise Exception("Simulated unhandled exception")

    client = TestClient(app, raise_server_exceptions=False)
    response = client.get("/api/force-error")
    assert response.status_code == 500
    assert response.json() == {
        "detail": "Internal server error. Please try again later.",
        "error_code": "INTERNAL_ERROR",
    }


def test_cors_origins_list():
    s = Settings(CORS_ORIGINS=["http://localhost:3000", "http://test.com"])
    assert s.CORS_ORIGINS == ["http://localhost:3000", "http://test.com"]


def test_groq_service_init_error(monkeypatch):
    import importlib

    import app.services.groq_service as gs

    # Reloading module with bad api key to trigger the exception branch
    monkeypatch.setenv("GROQ_API_KEY", "bad_key")

    # Actually just test the _fallback_response explicitly first
    fallback = gs._fallback_response()
    assert "demo mode" in fallback.lower()

    # Try to mock the AsyncGroq constructor to raise Exception
    import groq

    def mock_async_groq(*args, **kwargs):
        raise Exception("Mock init error")

    monkeypatch.setattr(groq, "AsyncGroq", mock_async_groq)

    # Reload the module to cover lines 19-22
    importlib.reload(gs)
    assert gs.client is None


@pytest.mark.asyncio
async def test_groq_service_edge_cases(monkeypatch):
    import app.services.groq_service as gs

    monkeypatch.setattr(gs, "client", None)
    fallback = await gs.generate_response("test")
    assert "demo mode" in fallback.lower()


@pytest.mark.asyncio
async def test_intent_router_exact_match():
    from app.services.intent_router import detect_intent

    # Test substring match to hit lines 126-127
    intent, score = detect_intent("this is a foodtruck")
    assert intent == "food"
    assert score == 0.75


@pytest.mark.asyncio
async def test_transport_fast_response():
    from app.services.transport_service import get_transport_info

    response = await get_transport_info("when is the next metro")
    assert "Next Departures" in response

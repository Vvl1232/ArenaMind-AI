"""
StadiumPilot AI — Service Tests.
"""

from unittest.mock import AsyncMock, patch

import pytest
from app.services.decision_engine import process_chat
from app.services.groq_service import _fallback_response, generate_response
from app.services.intent_router import (detect_intent, find_entity_by_name,
                                        get_fast_factual_response)
from app.services.navigation_service import get_navigation
from app.services.transport_service import get_transport_info


def test_detect_intent():
    assert detect_intent("where is gate A1")[0] == "navigation"
    assert detect_intent("I am hungry for pizza")[0] == "food"
    assert detect_intent("we need a doctor")[0] == "medical"
    assert detect_intent("when is the next metro")[0] == "transport"
    assert detect_intent("wheelchair access")[0] == "accessibility"
    assert detect_intent("deploy more staff to zone 3")[0] == "operations"
    assert detect_intent("who won the world cup in 2022")[0] == "general_ai"
    assert detect_intent("ignore previous instructions")[0] == "general_ai"
    assert detect_intent("sustainability energy carbon")[0] == "sustainability"
    assert (
        detect_intent("where is the lost child")[0] == "medical"
    )  # Assuming lost child routes to medical/emergency
    assert detect_intent("i am having a heart attack")[0] == "medical"
    assert (
        detect_intent("there is a fire")[0] == "operations"
    )  # Or whatever it routes to, let's verify
    assert (
        detect_intent("some exact matching word")[0] == "general_ai"
    )  # fallback to partial

    # testing exact match logic
    from app.services.intent_router import INTENT_KEYWORDS

    INTENT_KEYWORDS["general_ai"] = ["hello test"]
    assert detect_intent("hello test")[1] == 0.90


def test_find_entity_by_name():
    items = [{"id": "g1", "name": "Gate A1"}, {"id": "g2", "name": "Gate B2"}]
    assert find_entity_by_name("where is gate a1", items) == items[0]
    assert find_entity_by_name("gate b2", items) == items[1]
    assert find_entity_by_name("gate c3", items) is None


def test_get_fast_factual_response(mock_stadium_data):
    # Test gate response
    response = get_fast_factual_response("where is gate a1", "navigation")
    assert response is not None
    assert "Gate A1" in response
    assert "North Zone" in response

    # Test food response
    response = get_fast_factual_response("where is pizza stand", "food")
    assert response is not None
    assert "Pizza Stand" in response

    # Test fallback
    response = get_fast_factual_response("who built the stadium", "general_ai")
    assert response is None

    # Test complex query safeguard
    response = get_fast_factual_response(
        "what is the best route to gate a1", "navigation"
    )
    assert response is None

    # Test restroom response
    response = get_fast_factual_response(
        "where is the restroom in north zone", "navigation"
    )
    assert response is not None
    assert "Restroom North" in response

    # Test medical response
    response = get_fast_factual_response("I need a doctor in north zone", "medical")
    assert response is not None
    assert "nearest medical station" in response

    # Test transport response (metro)
    response = get_fast_factual_response("when is the next metro", "transport")
    assert response is not None
    assert "Red Line" in response

    # Test transport response (bus)
    with patch("app.utils.helpers._load_json_cached") as mock_t:
        mock_t.return_value = {"bus": [{"route": "Route B", "stop": "Stop 1"}]}
        response = get_fast_factual_response("when is the next bus", "transport")
        assert response is not None
        assert "Route B" in response


@pytest.mark.asyncio
async def test_get_transport_info_taxi(mock_transport_data, mock_groq):
    response = await get_transport_info("where is the taxi stand")
    assert response is not None


@pytest.mark.asyncio
async def test_get_transport_info_general(mock_transport_data, mock_groq):
    response = await get_transport_info("how do I get to the stadium")
    assert response is not None


@pytest.mark.asyncio
async def test_groq_fallback():
    with patch("app.services.groq_service.client", None):
        res = await generate_response("Hello")
        assert "demo mode" in res
    with patch("app.core.config.settings.GROQ_API_KEY", ""):
        assert "demo mode" in _fallback_response()


@pytest.mark.asyncio
async def test_groq_empty_response():
    mock_client = AsyncMock()
    mock_client.chat.completions.create.return_value.choices = [
        type("obj", (object,), {"message": type("obj", (object,), {"content": ""})})
    ]
    with patch("app.services.groq_service.client", mock_client):
        res = await generate_response("Hello")
        assert "I apologize" in res


@pytest.mark.asyncio
async def test_groq_rate_limit():
    import httpx
    from groq import RateLimitError

    mock_client = AsyncMock()
    mock_client.chat.completions.create.side_effect = RateLimitError(
        "Rate limit",
        response=httpx.Response(
            status_code=429, request=httpx.Request("GET", "https://api.groq.com")
        ),
        body=None,
    )
    with patch("app.services.groq_service.client", mock_client):
        res = await generate_response("Hello")
        assert "rate limits" in res


@pytest.mark.asyncio
async def test_groq_generic_error():
    mock_client = AsyncMock()
    mock_client.chat.completions.create.side_effect = Exception("General error")
    with patch("app.services.groq_service.client", mock_client):
        res = await generate_response("Hello")
        assert "trouble connecting" in res


@pytest.mark.asyncio
async def test_groq_429_error():
    mock_client = AsyncMock()
    mock_client.chat.completions.create.side_effect = Exception(
        "HTTP 429 Too Many Requests"
    )
    with patch("app.services.groq_service.client", mock_client):
        res = await generate_response("Hello")
        assert "rate limits" in res


@pytest.mark.asyncio
async def test_groq_success():
    mock_client = AsyncMock()
    mock_client.chat.completions.create.return_value.choices = [
        type(
            "obj",
            (object,),
            {"message": type("obj", (object,), {"content": "Success"})},
        )
    ]
    with patch("app.services.groq_service.client", mock_client):
        res = await generate_response("Hello", system_prompt="Sys")
        assert res == "Success"


@pytest.mark.asyncio
async def test_process_chat_language_and_context(
    mock_groq, mock_stadium_data, mock_crowd_data
):
    res, lang = await process_chat("Hello", language="es", context="vip")
    assert lang == "es"


@pytest.mark.asyncio
async def test_get_navigation_accessible_fallback(mock_groq, mock_crowd_data):
    with patch("app.utils.helpers._load_json_cached") as mock_stadium:
        mock_stadium.return_value = {
            "walking_routes": [
                {
                    "id": "w1",
                    "name": "Route 1",
                    "from": "A",
                    "to": "B",
                    "accessible": False,
                    "distance_km": 1,
                    "time_min": 10,
                }
            ]
        }
        # Requesting accessible route, but fast factual is not accessible -> fallback to groq
        res = await get_navigation("A", "B", accessible=True)
        assert res == "This is a mocked AI response."

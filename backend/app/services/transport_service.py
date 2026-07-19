"""
StadiumPilot AI — Transport Service.

Provides AI-powered transport guidance for fans travelling to and from the stadium.
"""

from app.core.prompts import build_transport_prompt
from app.services import groq_service
from app.services.intent_router import get_fast_factual_response
from app.utils.helpers import format_data_for_prompt, get_transport_data, sanitize_input
from app.utils.logger import logger


async def get_transport_info(query: str) -> str:
    """Generate transport recommendations.

    Args:
        query: Transport-related question from the user.

    Returns:
        AI-generated transport guidance.
    """
    clean_query = sanitize_input(query)
    logger.info("Transport query: %s", clean_query[:80])

    # 1. Fast Factual Response Check
    fast_response = get_fast_factual_response(clean_query, "transport")
    if fast_response:
        logger.info("Serving fast factual transport response (bypassing Groq).")
        return fast_response

    # 2. Context Reduction for Groq
    transport_data = get_transport_data()

    query_lower = clean_query.lower()
    filtered_transport = {}
    if "taxi" in query_lower or "uber" in query_lower or "lyft" in query_lower:
        filtered_transport["taxi"] = transport_data.get("taxi", [])
        filtered_transport["rideshare"] = transport_data.get("rideshare", [])
    else:
        filtered_transport = transport_data

    prompt = build_transport_prompt(
        query=clean_query,
        transport_data=format_data_for_prompt(filtered_transport),
    )

    response = await groq_service.generate_response(prompt)
    return response

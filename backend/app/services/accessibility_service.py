"""
StadiumPilot AI — Accessibility Service.

Provides AI-powered accessibility assistance for fans with special needs.
"""

from app.core.prompts import build_accessibility_prompt
from app.services import groq_service
from app.utils.helpers import format_data_for_prompt, get_stadium_data, sanitize_input
from app.utils.logger import logger


async def get_accessibility_info(query: str) -> str:
    """Generate accessibility guidance.

    Args:
        query: Accessibility-related question from the user.

    Returns:
        AI-generated accessibility information and guidance.
    """
    clean_query = sanitize_input(query)
    logger.info("Accessibility query: %s", clean_query[:80])

    stadium_data = get_stadium_data()

    prompt = build_accessibility_prompt(
        query=clean_query,
        stadium_data=format_data_for_prompt(stadium_data),
    )

    response = await groq_service.generate_response(prompt)
    return response

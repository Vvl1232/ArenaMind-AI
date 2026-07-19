"""
StadiumPilot AI — Operations Service.

Provides AI-powered operational recommendations for organizers and staff.
"""

from app.core.prompts import build_operations_prompt
from app.services import groq_service
from app.utils.helpers import (
    format_data_for_prompt,
    get_crowd_data,
    get_stadium_data,
    sanitize_input,
)
from app.utils.logger import logger


async def get_operations_recommendation(
    scenario: str, priority: str = "medium", zone: str | None = None
) -> str:
    """Generate operational recommendations for a given scenario.

    Args:
        scenario: Description of the operational scenario.
        priority: Priority level (low/medium/high/critical).
        zone: Specific zone to focus on, if any.

    Returns:
        AI-generated operational action plan.
    """
    clean_scenario = sanitize_input(scenario)
    clean_zone = sanitize_input(zone) if zone else None
    logger.info("Operations request: priority=%s, zone=%s", priority, clean_zone)

    stadium_data = get_stadium_data()
    crowd_data = get_crowd_data()

    # Enrich the scenario with priority and zone context
    enriched_scenario = f"[Priority: {priority.upper()}]"
    if clean_zone:
        enriched_scenario += f" [Zone: {clean_zone}]"
    enriched_scenario += f"\n\n{clean_scenario}"

    prompt = build_operations_prompt(
        scenario=enriched_scenario,
        stadium_data=format_data_for_prompt(stadium_data),
        crowd_data=format_data_for_prompt(crowd_data),
    )

    response = await groq_service.generate_response(prompt)
    return response

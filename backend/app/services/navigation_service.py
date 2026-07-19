"""
StadiumPilot AI — Navigation Service.

Provides AI-powered wayfinding and route guidance inside the stadium.
"""

from app.core.prompts import build_navigation_prompt
from app.services import groq_service
from app.utils.helpers import (
    format_data_for_prompt,
    get_crowd_data,
    get_stadium_data,
    sanitize_input,
)
from app.utils.logger import logger


async def get_navigation(
    origin: str, destination: str, accessible: bool = False
) -> str:
    """Generate navigation instructions between two stadium locations.

    Args:
        origin: Starting point within the stadium.
        destination: Target location.
        accessible: Whether to provide wheelchair-accessible routes.

    Returns:
        AI-generated navigation instructions.
    """
    clean_origin = sanitize_input(origin)
    clean_destination = sanitize_input(destination)
    logger.info(
        "Navigation request: %s → %s (accessible=%s)",
        clean_origin,
        clean_destination,
        accessible,
    )

    stadium_data = get_stadium_data()
    crowd_data = get_crowd_data()

    # Fast Factual Path Check for exact Walking Routes
    walking_routes = stadium_data.get("walking_routes", [])
    for route in walking_routes:
        if (
            route["from"].lower() in clean_origin.lower()
            and route["to"].lower() in clean_destination.lower()
        ):
            if accessible and not route.get("accessible"):
                continue  # Need accessible route, but this one isn't
            logger.info(
                "Serving fast factual navigation response from predefined routes."
            )
            return (
                f"🗺️ **Route: {route['name']}**\n\n"
                f"- **Distance:** {route['distance_km']} km\n"
                f"- **Est. Time:** {route['time_min']} mins\n"
                f"- **Note:** {route.get('notes', '')}\n\n"
                f"*This is a predefined fast route. Follow the stadium signs.*"
            )

    # Context Reduction for Groq
    filtered_stadium = {
        "gates": stadium_data.get("gates", []),
        "restrooms": stadium_data.get("restrooms", []),
        "medical": stadium_data.get("medical", []),
        "emergency_exits": stadium_data.get("emergency_exits", []),
    }

    prompt = build_navigation_prompt(
        origin=clean_origin,
        destination=clean_destination,
        stadium_data=format_data_for_prompt(filtered_stadium),
        crowd_data=format_data_for_prompt(crowd_data),
        accessible=accessible,
    )

    response = await groq_service.generate_response(prompt)
    return response

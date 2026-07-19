"""
StadiumPilot AI — Intent Router & Fast Path Service.

Intercepts user questions, detects the intent via keywords,
and serves direct factual responses from local JSON data when possible,
bypassing the Groq API to save quota and reduce latency.
"""

import typing

from app.utils.helpers import (_INJECTION_PATTERN, get_stadium_data,
                               get_transport_data)
from app.utils.logger import logger

INTENT_KEYWORDS = {
    "navigation": [
        "where is",
        "how to get to",
        "directions to",
        "find",
        "gate",
        "section",
    ],
    "food": [
        "food",
        "eat",
        "drink",
        "restaurant",
        "hungry",
        "thirsty",
        "burger",
        "pizza",
        "coffee",
        "halal",
        "vegan",
        "menu",
    ],
    "medical": [
        "medical",
        "doctor",
        "emergency",
        "first aid",
        "hurt",
        "injured",
        "defibrillator",
        "ambulance",
        "heart attack",
        "lost child",
    ],
    "transport": [
        "transport",
        "bus",
        "metro",
        "train",
        "taxi",
        "uber",
        "lyft",
        "rideshare",
        "parking",
        "shuttle",
        "station",
    ],
    "accessibility": [
        "wheelchair",
        "accessible",
        "disability",
        "elevator",
        "ramp",
        "assistance",
        "disabled",
    ],
    "crowd": ["crowd", "busy", "wait time", "queue", "congestion", "empty", "density"],
    "operations": [
        "deploy",
        "manage",
        "scenario",
        "incident",
        "evacuate",
        "staff",
        "volunteer",
        "fire",
        "bottleneck",
    ],
    "sustainability": [
        "sustainability",
        "energy",
        "waste",
        "carbon",
        "recycle",
        "green",
        "environment",
    ],
}


def detect_intent(query: str) -> tuple[str, float]:
    """Classifies the query into a predefined intent category with a confidence score."""
    query_lower = query.lower()

    # Robust check for prompt injection keywords
    if _INJECTION_PATTERN.search(query):
        logger.warning("Prompt injection attempt detected in query: %s", query)
        return "general_ai", 0.0

    # Priority checks for direct commands or obvious intents
    if any(kw in query_lower for kw in INTENT_KEYWORDS["operations"]):
        return "operations", 0.95

    if any(kw in query_lower for kw in INTENT_KEYWORDS["medical"]):
        return "medical", 0.95

    if any(kw in query_lower for kw in INTENT_KEYWORDS["accessibility"]):
        return "accessibility", 0.95

    if any(kw in query_lower for kw in INTENT_KEYWORDS["sustainability"]):
        return "sustainability", 0.95

    # Check for exact matches vs partial matches
    best_intent = "general_ai"
    max_confidence = 0.5

    for intent, keywords in INTENT_KEYWORDS.items():
        for kw in keywords:
            if kw in query_lower:
                # Exact word match gets higher confidence than substring
                if f" {kw} " in f" {query_lower} ":
                    return intent, 0.90
                best_intent = intent
                max_confidence = 0.75

    return best_intent, max_confidence


def find_entity_by_name(
    query: str, items: list[dict[str, typing.Any]], name_key: str = "name"
) -> dict[str, typing.Any] | None:
    """Find a specific entity by matching the query against the item's name/id."""
    query_clean = query.lower().replace("?", "").replace(".", "").strip()

    # Try exact match or substring match
    for item in items:
        item_name = item.get(name_key, "").lower()
        item_id = item.get("id", "").lower()
        if item_name in query_clean or item_id in query_clean:
            return item
    return None


def get_fast_factual_response(query: str, intent: str) -> str | None:
    """
    Attempt to answer the question directly using local JSON data.
    Returns the markdown response if successful, or None if Groq is required.
    """
    logger.info("Attempting fast factual response for intent: %s", intent)

    query_lower = query.lower()

    # 0. Safeguard against complex queries
    complex_keywords = [
        "plan",
        "avoid",
        "compare",
        "best",
        "crowded",
        "safest",
        "route",
        "from",
    ]
    if any(kw in query_lower for kw in complex_keywords) and intent != "transport":
        logger.info("Complex query detected, skipping fast factual response.")
        return None

    stadium_data = get_stadium_data()

    # 1. NAVIGATION (Simple locations like Gates, Restrooms)
    if intent == "navigation":
        # Check Gates
        gate = find_entity_by_name(query, stadium_data.get("gates", []))
        if gate:
            status = "🟢 Open" if gate.get("status") == "open" else "🔴 Closed"
            return (
                f"**{gate['name']}** is located in the **{gate['zone']} Zone** on Floor {gate['floor']}.\n\n"
                f"- **Status:** {status}\n"
                f"- **Current Wait Time:** {gate.get('wait_time_min', 0)} mins\n"
                f"- **Accessible:** {'Yes ✅' if gate.get('accessible') else 'No ❌'}"
            )

        # Check Restrooms
        if (
            "restroom" in query_lower
            or "toilet" in query_lower
            or "bathroom" in query_lower
        ):
            # Just return a summary of restrooms in a specific zone if mentioned, or general
            restrooms = stadium_data.get("restrooms", [])
            closest = restrooms[0]  # Simplification for fast path
            for r in restrooms:
                if r["zone"].lower() in query_lower:
                    closest = r
                    break
            return (
                f"The closest restroom based on your query is **{closest['name']}** in the **{closest['zone']} Zone** (Floor {closest['floor']}).\n"
                f"Wait time is approximately {closest.get('wait_time_min', 0)} mins."
            )

    # 2. FOOD
    if intent == "food":
        food_courts = stadium_data.get("food_courts", [])
        food = find_entity_by_name(query, food_courts)
        if food:
            return (
                f"**{food['name']}** ({food['cuisine']})\n"
                f"- **Location:** {food['zone']} Zone, Floor {food['floor']}\n"
                f"- **Wait Time:** {food.get('wait_time_min', 0)} mins\n"
                f"- **Menu Highlights:** {', '.join(food.get('items', []))}"
            )

    # 3. MEDICAL & EMERGENCY
    if intent == "medical":
        medical_centers = stadium_data.get("medical", [])
        if medical_centers:
            med = medical_centers[0]
            for m in medical_centers:
                if m["zone"].lower() in query_lower:
                    med = m
                    break
            return (
                f"🚑 **Medical Assistance Location:**\n\n"
                f"The nearest medical station is **{med['name']}** in the **{med['zone']} Zone** (Floor {med['floor']}).\n"
                f"Services available: {', '.join(med.get('services', []))}.\n\n"
                f"If this is an emergency, please notify the nearest volunteer or security personnel immediately."
            )

    # 4. TRANSPORT (Factual queries like "when is the next metro")
    if intent == "transport":
        transport_data = get_transport_data()
        if "metro" in query_lower or "train" in query_lower:
            metro = transport_data.get("metro", [])[0]
            return (
                f"🚆 **{metro['line']}** ({metro['station']})\n\n"
                f"- **Next Departures:** {', '.join(metro.get('next_departures', []))}\n"
                f"- **Walk Time:** {metro.get('walk_time_min', 0)} mins\n"
                f"- **Fare:** {metro.get('fare', 'Unknown')}"
            )
        if "bus" in query_lower or "shuttle" in query_lower:
            bus = transport_data.get("bus", [])[0]
            return (
                f"🚌 **{bus['route']}** ({bus['stop']})\n\n"
                f"- **Next Departures:** {', '.join(bus.get('next_departures', []))}\n"
                f"- **Destination:** {bus.get('destination', 'Unknown')}\n"
                f"- **Walk Time:** {bus.get('walk_time_min', 0)} mins"
            )

    # If no simple factual answer can be determined, fallback to Groq
    logger.info("No fast factual response generated. Falling back to Groq.")
    return None

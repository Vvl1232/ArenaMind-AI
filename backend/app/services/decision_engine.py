"""
StadiumPilot AI — Decision Engine Service.
Central intelligence service that coordinates across all sub-services
to provide unified AI responses for the stadium assistant.
"""

from app.core.prompts import build_assistant_prompt
from app.services import groq_service
from app.services.intent_router import detect_intent, get_fast_factual_response
from app.utils.helpers import (format_data_for_prompt, get_crowd_data,
                               get_stadium_data, sanitize_input)
from app.utils.logger import logger


async def process_chat(
    message: str, language: str | None = None, context: str | None = None
) -> tuple[str, str]:
    """Process a chat message through the decision engine.
    Loads stadium and crowd data, builds a contextual prompt, and sends it to Groq.
    Args:
        message: The user's message.
        language: Preferred response language (auto-detected if None).
        context: Additional context for the query.
    Returns:
        Tuple of (response_text, detected_language).
    """
    clean_message = sanitize_input(message)
    clean_context = sanitize_input(context) if context else None
    logger.info("Processing chat: '%s'", clean_message[:80])

    # 1. Intent Detection
    intent, confidence = detect_intent(clean_message)
    logger.info("Detected intent: %s (confidence: %.2f)", intent, confidence)

    if confidence < 0.6:
        intent = "general_ai"

    # 2. Fast Factual Response Check
    if not clean_context:
        fast_response = get_fast_factual_response(clean_message, intent)
        if fast_response:
            logger.info("Serving fast factual response (bypassing Groq).")
            return fast_response, language or "en"

    # 3. Context Reduction for Groq — explicit per-intent scoping, no silent full-data fallback
    stadium_data = get_stadium_data()
    crowd_data = get_crowd_data()

    intent_scope = {
        "navigation": ["gates", "restrooms"],
        "food": ["food_courts"],
        "medical": ["medical"],
        "transport": ["parking"],
        "operations": list(stadium_data.keys()),
    }
    keys = intent_scope.get(intent, ["gates", "food_courts", "medical"])
    filtered_stadium = {k: stadium_data.get(k, []) for k in keys}

    crowd_relevant = intent in ("operations", "navigation", "general_ai")
    filtered_crowd = crowd_data if crowd_relevant else {}

    question = clean_message
    if language:
        question += f"\n\n[Respond in {language}]"
    if clean_context:
        question += f"\n\n[Additional context: {clean_context}]"

    prompt = build_assistant_prompt(
        question=question,
        stadium_data=format_data_for_prompt(filtered_stadium),
        crowd_data=format_data_for_prompt(filtered_crowd),
    )
    response = await groq_service.generate_response(prompt)
    detected_language = language or "auto"
    return response, detected_language

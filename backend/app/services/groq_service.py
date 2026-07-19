"""
StadiumPilot AI — Groq Service.

Handles all communication with the Groq API using the async client
to prevent blocking Vercel's serverless runtime.
"""

from groq import AsyncGroq, RateLimitError

from app.core.config import settings
from app.utils.logger import logger

# Initialize async Groq client
client = None
if settings.GROQ_API_KEY:
    try:
        client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        logger.info("Groq API configured successfully (async client).")
    except Exception as e:
        logger.error("Failed to initialize Groq client: %s", e)
else:
    logger.warning("GROQ_API_KEY not set — Groq calls will use fallback responses.")


async def generate_response(prompt: str, system_prompt: str | None = None) -> str:
    """Send a prompt to Groq and return the generated text.

    Args:
        prompt: The user-facing prompt content.
        system_prompt: Optional system message for the model.  When provided,
            the conversation uses a proper ``system`` / ``user`` message split
            for better model adherence to instructions.

    Returns:
        The AI-generated response text.
    """

    if not client:
        logger.warning("Groq API client not configured — returning fallback response.")
        return _fallback_response()

    try:
        logger.info("Generating Groq response for prompt length: %d chars", len(prompt))

        # Build messages with proper role separation when a system prompt is given
        messages: list[dict[str, str]] = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = await client.chat.completions.create(
            messages=messages,  # type: ignore
            model=settings.GROQ_MODEL,
            max_tokens=1024,
            temperature=0.7,
            top_p=0.9,
        )

        result = response.choices[0].message.content
        if not result:
            logger.warning("Groq returned an empty response.")
            return (
                "I apologize, but I couldn't generate a clear response for that. "
                "Could you please rephrase your question?"
            )

        logger.info("Groq response generated successfully (%d chars).", len(result))
        return result

    except RateLimitError:
        logger.warning("Groq API rate limit exceeded. Falling back to safe response.")
        return (
            "AI reasoning is temporarily unavailable due to API rate limits. "
            "Basic stadium information is still available."
        )

    except Exception as exc:
        logger.exception("Groq API error:")
        # Handle Rate Limit / Quota specific errors
        if "429" in str(exc):
            logger.warning(
                "Groq API rate limit exceeded. Falling back to safe response."
            )
            return (
                "AI reasoning is temporarily unavailable due to API rate limits. "
                "Basic stadium information is still available."
            )

        # For other blocked/failed responses, return a generic error instead of crashing
        return (
            "I'm having trouble connecting to the AI services right now. "
            "Please try again in a moment."
        )


def _fallback_response() -> str:
    """Return a fallback response when Groq is unavailable."""
    return (
        "⚠️ **StadiumPilot AI is currently in demo mode.**\n\n"
        "The Groq API key has not been configured.\n\n"
        "1. Get an API key from Groq Cloud.\n"
        "2. Set GROQ_API_KEY in your environment.\n"
        "3. Restart the backend.\n\n"
        "Stadium information is still available."
    )

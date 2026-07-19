"""
StadiumPilot AI — Utility Helpers.

Data loading and general utility functions.
"""

import json
import re
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.core.config import settings
from app.utils.logger import logger


@lru_cache(maxsize=1)
def _load_json_cached(file_path: str) -> dict[str, Any]:
    """Load and parse a JSON data file with in-memory caching.

    Uses ``lru_cache`` so that static JSON datasets (stadium, crowd, transport)
    are only read from disk once per process lifetime.

    Args:
        file_path: String representation of the absolute path to the JSON file.
                   Accepts a string (not ``Path``) because ``lru_cache`` requires
                   hashable arguments.

    Returns:
        Parsed JSON as a dictionary.

    Raises:
        FileNotFoundError: If the file does not exist.
        json.JSONDecodeError: If the file contains invalid JSON.
    """
    path = Path(file_path)
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        logger.info("Loaded and cached data from %s", path.name)
        return data
    except FileNotFoundError:
        logger.error("Data file not found: %s", path)
        raise
    except json.JSONDecodeError as exc:
        logger.error("Invalid JSON in %s: %s", path, exc)
        raise


def load_json_data(file_path: Path) -> dict[str, Any]:
    """Load and parse a JSON data file (cached).

    Args:
        file_path: Absolute path to the JSON file.

    Returns:
        Parsed JSON as a dictionary.

    Raises:
        FileNotFoundError: If the file does not exist.
        json.JSONDecodeError: If the file contains invalid JSON.
    """
    return _load_json_cached(str(file_path))


def get_stadium_data() -> dict[str, Any]:
    """Load the stadium dataset (cached after first call)."""
    return load_json_data(settings.stadium_data_path)


def get_crowd_data() -> dict[str, Any]:
    """Load the crowd intelligence dataset (cached after first call)."""
    return load_json_data(settings.crowd_data_path)


def get_transport_data() -> dict[str, Any]:
    """Load the transport dataset (cached after first call)."""
    return load_json_data(settings.transport_data_path)


def format_data_for_prompt(data: dict[str, Any], max_length: int = 8000) -> str:
    """Format a data dictionary as a compact JSON string for prompt injection.

    Args:
        data: Dictionary to format.
        max_length: Maximum character length for the output.

    Returns:
        JSON string, truncated if necessary.
    """
    text = json.dumps(data, indent=None, ensure_ascii=False)
    if len(text) > max_length:
        text = text[:max_length] + "\n... [data truncated for brevity]"
    return text


# Compiled regex for prompt-injection markers — avoids recompilation per call.
_INJECTION_PATTERN = re.compile(
    r"(ignore\s+(?:all\s+)?(?:previous|above|all)?\s*instructions"
    r"|you\s+are\s+now"
    r"|system\s*:\s*"
    r"|<\s*script"
    r"|javascript\s*:"
    r"|on(error|load|click)\s*=)",
    re.IGNORECASE,
)


def sanitize_input(text: str) -> str:
    """Sanitise user input — strip whitespace, limit length, and neutralise injection.

    Args:
        text: Raw user input.

    Returns:
        Sanitised string safe for prompt inclusion.
    """
    cleaned = text.strip()[:2000]
    # Neutralise prompt-injection patterns by replacing them with empty string
    cleaned = _INJECTION_PATTERN.sub("", cleaned)
    return cleaned.strip()


def clear_data_cache() -> None:
    """Clear the in-memory JSON data cache.  Useful for testing."""
    _load_json_cached.cache_clear()
    logger.info("Data cache cleared.")

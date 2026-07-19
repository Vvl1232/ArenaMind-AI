"""
StadiumPilot AI — Logging Configuration.
"""

import json
import logging
import sys

# Create the application logger
logger = logging.getLogger("stadiumpilot")
logger.setLevel(logging.INFO)

# Console handler
_handler = logging.StreamHandler(sys.stdout)
_handler.setLevel(logging.INFO)

class JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_obj = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_obj)


# Formatter
_formatter = JSONFormatter(datefmt="%Y-%m-%d %H:%M:%S")
_handler.setFormatter(_formatter)

# Avoid duplicate handlers on reimport
if not logger.handlers:
    logger.addHandler(_handler)

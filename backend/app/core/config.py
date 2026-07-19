"""
StadiumPilot AI — Core Configuration Module.

Loads environment variables and provides application-wide settings using pydantic-settings.
"""

from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Centralised application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parent.parent.parent / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_NAME: str = "StadiumPilot AI"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = (
        "Enterprise-grade AI platform for FIFA World Cup 2026 stadium operations and fan experience."
    )

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Groq API
    GROQ_API_KEY: str = Field(default="")
    GROQ_MODEL: str = "llama3-8b-8192"

    # CORS Configuration
    CORS_ORIGINS: str | list[str] = Field(
        default="http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173,https://stadiumpilot-ai-pi.vercel.app,https://arenamind-ai.vercel.app"
    )

    @field_validator("CORS_ORIGINS")
    @classmethod
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # Allow ALL Vercel preview and production deployments (covers any new repo/URL)
    CORS_ORIGIN_REGEX: str = r"https://[a-zA-Z0-9\-\.]+\.vercel\.app"

    # Data paths
    DATA_DIR: Path = Path(__file__).resolve().parent.parent / "data"

    @property
    def stadium_data_path(self) -> Path:
        return self.DATA_DIR / "stadium.json"

    @property
    def crowd_data_path(self) -> Path:
        return self.DATA_DIR / "crowd.json"

    @property
    def transport_data_path(self) -> Path:
        return self.DATA_DIR / "transport.json"


settings = Settings()

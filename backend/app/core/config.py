"""Application settings loaded from environment variables / .env file."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Reads configuration from environment or backend/.env.

    DATABASE_URL is required — the app will fail at startup with a clear
    error if it is missing.  FRONTEND_ORIGIN has a sensible dev default.
    """

    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str
    frontend_origin: str = "http://localhost:5173"


settings = Settings()

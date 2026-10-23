from pydantic_settings import BaseSettings, SettingsConfigDict


# Membaca konfigurasi environment dan file .env secara otomatis via Pydantic Settings.
class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str
    frontend_origin: str = "http://localhost:5173"


settings = Settings()

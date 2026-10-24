from pydantic_settings import BaseSettings, SettingsConfigDict


# endpoint utama aplikasi yang digunakan untuk mengatur konfigurasi dari file environment
class Settings(BaseSettings):
    # memuat konfigurasi dari file environment dan environment variables
    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str
    frontend_origin: str = "http://localhost:5173"


settings = Settings()

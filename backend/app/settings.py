from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "Meeting Archaeologist"
    app_version: str = "0.1.0"
    environment: str = "development"
    log_level: str = "INFO"
    cors_allowed_origin: list[str] = [
        "https://archeaoo.vercel.app/",
    ]
    gemini_api_key: str | None = None
    gemini_model: str = "gemini-2.0-flash-exp"

    max_retries: int = 2


settings = Settings()

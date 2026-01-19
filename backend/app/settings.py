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
    cors_allowed_origin: str = "http://localhost:3000"

    openrouter_api_key: str
    openrouter_model: str = "anthropic/claude-3.5-sonnet"
    openrouter_base_url: str = "https://openrouter.ai/api/v1"

    max_retries: int = 2


settings = Settings()

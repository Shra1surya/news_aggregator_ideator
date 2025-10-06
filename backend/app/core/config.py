from pydantic_settings import BaseSettings
from pydantic import ConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    ANTHROPIC_API_KEY: str
    ENVIRONMENT: str = "development"

    model_config = ConfigDict(
        env_file=".env",
        extra="ignore"  # Allow extra fields like proxy settings
    )


settings = Settings()

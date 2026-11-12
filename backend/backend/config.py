from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_SERVER: str
    DB_DATABASE: str
    DB_TRUSTED_CONNECTION: str = "YES"

    class Config:
        env_file = ".env"

settings = Settings()

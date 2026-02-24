from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str = ""
    supabase_service_role_key: str = ""
    openai_api_key: str = ""
    google_api_key: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"

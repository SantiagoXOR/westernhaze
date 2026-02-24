from supabase import create_client
from backend.config import Settings

_settings = Settings()


def get_supabase():
    return create_client(_settings.supabase_url, _settings.supabase_service_role_key)

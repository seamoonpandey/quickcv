import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "fallback_dev_key_change_in_prod")
    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/quickcv")
    WTF_CSRF_ENABLED = False  # Disabled for API — frontend handles CSRF separately
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    REMEMBER_COOKIE_HTTPONLY = True
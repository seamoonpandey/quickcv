import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    SECRET_KEY = os.environ.get("SECRET_KEY", "fallback_dev_key_change_in_prod")
    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/quickcv")
    WTF_CSRF_ENABLED = False  # Disabled for API — frontend handles CSRF separately
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "None"  # Allow cross-site cookies
    SESSION_COOKIE_SECURE = True       # Only send cookies over HTTPS
    REMEMBER_COOKIE_HTTPONLY = True
    # CORS origins (comma-separated)
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://127.0.0.1:5500,http://localhost:5500")

    # Upload storage options
    # local: store files on disk under UPLOAD_DIR and serve via /uploads
    # cloud: use Cloudinary signed uploads
    UPLOAD_STORAGE = os.environ.get("UPLOAD_STORAGE", "local").strip().lower()
    UPLOAD_DIR = os.environ.get("UPLOAD_DIR", os.path.join(BASE_DIR, "uploads"))
    MAX_IMAGE_UPLOAD_BYTES = int(os.environ.get("MAX_IMAGE_UPLOAD_BYTES", 2 * 1024 * 1024))

    CLOUDINARY_CLOUD_NAME = os.environ.get("CLOUDINARY_CLOUD_NAME", "").strip()
    CLOUDINARY_API_KEY = os.environ.get("CLOUDINARY_API_KEY", "").strip()
    CLOUDINARY_API_SECRET = os.environ.get("CLOUDINARY_API_SECRET", "").strip()
    CLOUDINARY_FOLDER = os.environ.get("CLOUDINARY_FOLDER", "quickcv").strip().strip("/")
import hashlib
import os
import time

from flask import Blueprint
from flask_login import current_user

from app.utils.decorators import login_required_api
from app.utils.response import error, success

upload_bp = Blueprint("uploads", __name__)


def _cloudinary_sign(params: dict, api_secret: str) -> str:
    """Create a Cloudinary signature from params.

    Cloudinary signing rules:
    - Sort params by key
    - Join as key=value with &
    - Append API secret
    - SHA1 hex digest
    """
    parts = []
    for key in sorted(params.keys()):
        value = params.get(key)
        if value is None or value == "":
            continue
        parts.append(f"{key}={value}")

    to_sign = "&".join(parts) + api_secret
    return hashlib.sha1(to_sign.encode("utf-8")).hexdigest()


@upload_bp.route("/cloudinary-signature", methods=["GET"])
@login_required_api
def get_cloudinary_signature():
    cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME", "").strip()
    api_key = os.environ.get("CLOUDINARY_API_KEY", "").strip()
    api_secret = os.environ.get("CLOUDINARY_API_SECRET", "").strip()
    folder_root = os.environ.get("CLOUDINARY_FOLDER", "quickcv").strip().strip("/")

    if not cloud_name or not api_key or not api_secret:
        return error("Cloudinary is not configured on the server.", 500)

    timestamp = int(time.time())
    folder = f"{folder_root}/cv_profile_images/{current_user.id}"

    params_to_sign = {
        "timestamp": timestamp,
        "folder": folder,
    }

    signature = _cloudinary_sign(params_to_sign, api_secret)

    return success(
        data={
            "cloud_name": cloud_name,
            "api_key": api_key,
            "timestamp": timestamp,
            "signature": signature,
            "folder": folder,
        }
    )

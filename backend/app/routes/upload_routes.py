import hashlib
import os
import time
from datetime import datetime

from flask import Blueprint, current_app, request, url_for
from flask_login import current_user
from werkzeug.utils import secure_filename

from app.utils.decorators import login_required_api
from app.utils.response import error, success

upload_bp = Blueprint("uploads", __name__)


ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "gif"}


def _get_storage_mode() -> str:
    mode = (current_app.config.get("UPLOAD_STORAGE") or "local").strip().lower()
    return mode if mode in {"local", "cloud"} else "local"


def _is_allowed_image(filename: str) -> bool:
    if not filename or "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in ALLOWED_IMAGE_EXTENSIONS


@upload_bp.route("/config", methods=["GET"])
@login_required_api
def get_upload_config():
    mode = _get_storage_mode()
    return success(data={"storage": mode})


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
    mode = _get_storage_mode()
    if mode != "cloud":
        return error("Cloudinary upload is disabled for this environment.", 400)

    cloud_name = (current_app.config.get("CLOUDINARY_CLOUD_NAME") or "").strip()
    api_key = (current_app.config.get("CLOUDINARY_API_KEY") or "").strip()
    api_secret = (current_app.config.get("CLOUDINARY_API_SECRET") or "").strip()
    folder_root = (current_app.config.get("CLOUDINARY_FOLDER") or "quickcv").strip().strip("/")

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
            "storage": "cloud",
            "cloud_name": cloud_name,
            "api_key": api_key,
            "timestamp": timestamp,
            "signature": signature,
            "folder": folder,
        }
    )


@upload_bp.route("/profile-image", methods=["POST"])
@login_required_api
def upload_profile_image_local():
    mode = _get_storage_mode()
    if mode != "local":
        return error("Local file upload is disabled for this environment.", 400)

    file = request.files.get("file")
    if not file:
        return error("No file provided.", 400)

    if not _is_allowed_image(file.filename):
        return error("Unsupported image type. Allowed: png, jpg, jpeg, webp, gif.", 400)

    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)

    max_size = int(current_app.config.get("MAX_IMAGE_UPLOAD_BYTES", 2 * 1024 * 1024))
    if file_size > max_size:
        return error("Image is too large. Please use an image under 2MB.", 400)

    safe_name = secure_filename(file.filename)
    ext = safe_name.rsplit(".", 1)[1].lower()
    now = datetime.utcnow()
    rel_folder = os.path.join(
        "cv_profile_images",
        str(current_user.id),
        now.strftime("%Y"),
        now.strftime("%m"),
    )
    target_dir = os.path.join(current_app.config["UPLOAD_DIR"], rel_folder)
    os.makedirs(target_dir, exist_ok=True)

    unique_name = f"{int(time.time())}_{os.urandom(6).hex()}.{ext}"
    abs_path = os.path.join(target_dir, unique_name)
    file.save(abs_path)

    rel_url_path = os.path.join(rel_folder, unique_name).replace("\\", "/")
    image_url = url_for("uploaded_file", filename=rel_url_path, _external=True)

    return success(
        data={
            "storage": "local",
            "url": image_url,
            "path": rel_url_path,
        },
        message="Image uploaded.",
    )

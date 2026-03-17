from flask import Blueprint
from app.utils.response import success

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health_check():
    return success(message="Quick CV API is running.")
from flask import Blueprint
from flask_login import current_user
from app.services.user_service import get_user_profile
from app.utils.response import success, error
from app.utils.decorators import login_required_api

user_bp = Blueprint("user", __name__)


@user_bp.route("/profile", methods=["GET"])
@login_required_api
def profile():
    user = get_user_profile(current_user.id)
    if not user:
        return error("User not found.", 404)
    return success(data=user)
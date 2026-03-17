from flask import Blueprint, request
from flask_login import current_user
from app.services.user_service import get_user_profile, update_user_profile
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


@user_bp.route("/profile", methods=["PUT"])
@login_required_api
def update_profile():
    data = request.get_json() or {}
    full_name = data.get("full_name", "")
    email = data.get("email", "")
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    updated_user, err = update_user_profile(
        current_user.id, full_name, email, current_password, new_password
    )
    if err:
        return error(err, 400)

    # Keep session info fresh
    current_user.full_name = updated_user["full_name"]
    current_user.email = updated_user["email"]

    return success(data=updated_user, message="Profile updated.")

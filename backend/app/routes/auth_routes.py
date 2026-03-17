from flask import Blueprint, request
from flask_login import login_user, logout_user, current_user
from app.services.auth_service import register_user, login_user_service
from app.utils.response import success, error
from app.utils.decorators import login_required_api

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return error("No data provided.")

    full_name = data.get("full_name", "")
    email = data.get("email", "")
    password = data.get("password", "")

    user, err = register_user(full_name, email, password)
    if err:
        return error(err)

    login_user(user)
    return success(
        data={"id": user.id, "full_name": user.full_name, "email": user.email},
        message="Registration successful.",
        status=201
    )


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return error("No data provided.")

    email = data.get("email", "")
    password = data.get("password", "")

    user, err = login_user_service(email, password)
    if err:
        return error(err, 401)

    login_user(user, remember=True)
    return success(
        data={"id": user.id, "full_name": user.full_name, "email": user.email},
        message="Login successful."
    )


@auth_bp.route("/logout", methods=["POST"])
@login_required_api
def logout():
    logout_user()
    return success(message="Logged out successfully.")


@auth_bp.route("/me", methods=["GET"])
@login_required_api
def me():
    return success(data={
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email
    })
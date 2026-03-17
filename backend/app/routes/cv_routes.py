from flask import Blueprint, request
from flask_login import current_user
from app.services.cv_service import get_all_cvs, get_cv, create_cv, update_cv, delete_cv
from app.utils.response import success, error
from app.utils.decorators import login_required_api

cv_bp = Blueprint("cvs", __name__)


@cv_bp.route("/", methods=["GET"])
@login_required_api
def list_cvs():
    cvs = get_all_cvs(current_user.id)
    return success(data=cvs)


@cv_bp.route("/", methods=["POST"])
@login_required_api
def create():
    data = request.get_json()
    if not data:
        return error("No data provided.")
    cv = create_cv(current_user.id, data)
    return success(data=cv, message="CV created.", status=201)


@cv_bp.route("/<cv_id>", methods=["GET"])
@login_required_api
def get_one(cv_id):
    cv = get_cv(cv_id, current_user.id)
    if not cv:
        return error("CV not found.", 404)
    return success(data=cv)


@cv_bp.route("/<cv_id>", methods=["PUT"])
@login_required_api
def update(cv_id):
    data = request.get_json()
    if not data:
        return error("No data provided.")
    updated = update_cv(cv_id, current_user.id, data)
    if not updated:
        return error("CV not found or unauthorized.", 404)
    return success(message="CV updated.")


@cv_bp.route("/<cv_id>", methods=["DELETE"])
@login_required_api
def delete(cv_id):
    deleted = delete_cv(cv_id, current_user.id)
    if not deleted:
        return error("CV not found or unauthorized.", 404)
    return success(message="CV deleted.")
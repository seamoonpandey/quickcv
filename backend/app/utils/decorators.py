from functools import wraps
from flask_login import current_user
from app.utils.response import error


def login_required_api(f):
    """API-safe login_required that returns JSON 401 instead of redirect."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not current_user.is_authenticated:
            return error("Unauthorized. Please log in.", 401)
        return f(*args, **kwargs)
    return decorated
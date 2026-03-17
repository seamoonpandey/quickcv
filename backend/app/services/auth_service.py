from app.database.mongo import get_db
from app.utils.security import hash_password, check_password
from app.utils.validators import is_valid_email, is_valid_password
from app.models.user_model import User
from datetime import datetime, timezone


def register_user(full_name, email, password):
    db = get_db()

    full_name = full_name.strip()
    email = email.strip().lower()

    if not full_name:
        return None, "Full name is required."
    if not is_valid_email(email):
        return None, "Invalid email address."

    valid, msg = is_valid_password(password)
    if not valid:
        return None, msg

    existing = db.users.find_one({"email": email})
    if existing:
        return None, "An account with this email already exists."

    password_hash = hash_password(password)

    user_doc = {
        "full_name": full_name,
        "email": email,
        "password_hash": password_hash,
        "created_at": datetime.now(timezone.utc)
    }

    result = db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    return User(user_doc), None


def login_user_service(email, password):
    db = get_db()
    email = email.strip().lower()

    user_doc = db.users.find_one({"email": email})
    if not user_doc:
        return None, "Invalid email or password."

    if not check_password(password, user_doc["password_hash"]):
        return None, "Invalid email or password."

    return User(user_doc), None
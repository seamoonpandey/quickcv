from app.database.mongo import get_db
from bson import ObjectId
from datetime import datetime, timezone
from app.utils.validators import is_valid_email, is_valid_password, sanitise_string
from app.utils.security import hash_password, check_password


def get_user_profile(user_id):
    db = get_db()
    user = db.users.find_one({"_id": ObjectId(user_id)}, {"password_hash": 0})
    if user:
        user["_id"] = str(user["_id"])
    return user


def update_user_profile(user_id, full_name, email, current_password=None, new_password=None):
    db = get_db()

    # Fetch current user
    user_doc = db.users.find_one({"_id": ObjectId(user_id)})
    if not user_doc:
        return None, "User not found."

    full_name = sanitise_string(full_name)
    email = (email or "").strip().lower()

    if not full_name:
        return None, "Full name is required."
    if not is_valid_email(email):
        return None, "Invalid email address."

    # Ensure email is unique
    existing = db.users.find_one(
        {"email": email, "_id": {"$ne": ObjectId(user_id)}}
    )
    if existing:
        return None, "Another account already uses this email."

    update_fields = {
        "full_name": full_name,
        "email": email,
        "updated_at": datetime.now(timezone.utc),
    }

    if new_password:
        valid, msg = is_valid_password(new_password)
        if not valid:
            return None, msg
        if not current_password or not check_password(current_password, user_doc["password_hash"]):
            return None, "Current password is incorrect."
        update_fields["password_hash"] = hash_password(new_password)

    db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_fields})

    user_doc.update(update_fields)
    return {
        "id": str(user_doc["_id"]),
        "full_name": user_doc["full_name"],
        "email": user_doc["email"],
    }, None

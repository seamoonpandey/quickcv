from app.database.mongo import get_db
from bson import ObjectId


def get_user_profile(user_id):
    db = get_db()
    user = db.users.find_one({"_id": ObjectId(user_id)}, {"password_hash": 0})
    if user:
        user["_id"] = str(user["_id"])
    return user
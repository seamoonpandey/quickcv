from flask_login import UserMixin
from app.extensions import login_manager
from app.database.mongo import get_db
from bson import ObjectId


class User(UserMixin):
    def __init__(self, user_doc):
        self.id = str(user_doc["_id"])
        self.full_name = user_doc["full_name"]
        self.email = user_doc["email"]
        self.password_hash = user_doc["password_hash"]

    def get_id(self):
        return self.id


@login_manager.user_loader
def load_user(user_id):
    db = get_db()
    user_doc = db.users.find_one({"_id": ObjectId(user_id)})
    if user_doc:
        return User(user_doc)
    return None
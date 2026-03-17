from app.database.mongo import get_db
from app.models.cv_model import new_cv_doc
from bson import ObjectId
from datetime import datetime, timezone


def get_all_cvs(user_id):
    db = get_db()
    cvs = list(db.cvs.find({"user_id": user_id}, {"personal_info": 1, "title": 1, "template": 1, "updated_at": 1}))
    for cv in cvs:
        cv["_id"] = str(cv["_id"])
    return cvs


def get_cv(cv_id, user_id):
    db = get_db()
    cv = db.cvs.find_one({"_id": ObjectId(cv_id), "user_id": user_id})
    if cv:
        cv["_id"] = str(cv["_id"])
    return cv


def create_cv(user_id, data):
    db = get_db()
    title = data.get("title", "Untitled CV")
    template = data.get("template", "modern")
    doc = new_cv_doc(user_id, title, template)

    doc["personal_info"] = data.get("personal_info", doc["personal_info"])
    doc["education"] = data.get("education", [])
    doc["experience"] = data.get("experience", [])
    doc["skills"] = data.get("skills", [])

    result = db.cvs.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


def update_cv(cv_id, user_id, data):
    db = get_db()

    update_fields = {
        "title": data.get("title", "Untitled CV"),
        "template": data.get("template", "modern"),
        "personal_info": data.get("personal_info", {}),
        "education": data.get("education", []),
        "experience": data.get("experience", []),
        "skills": data.get("skills", []),
        "updated_at": datetime.now(timezone.utc)
    }

    result = db.cvs.update_one(
        {"_id": ObjectId(cv_id), "user_id": user_id},
        {"$set": update_fields}
    )
    return result.matched_count > 0


def delete_cv(cv_id, user_id):
    db = get_db()
    result = db.cvs.delete_one({"_id": ObjectId(cv_id), "user_id": user_id})
    return result.deleted_count > 0
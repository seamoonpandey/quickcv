from datetime import datetime, timezone


def new_cv_doc(user_id, title="Untitled CV", template="modern"):
    """Returns a clean CV document for insertion into MongoDB."""
    return {
        "user_id": user_id,
        "title": title,
        "template": template,
        "personal_info": {
            "full_name": "",
            "email": "",
            "phone": "",
            "location": "",
            "website": "",
            "social_links": [],
            "summary": ""
        },
        "education": [],
        "experience": [],
        "skills": [],
        "certificates": [],
        "custom_sections": [],
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }

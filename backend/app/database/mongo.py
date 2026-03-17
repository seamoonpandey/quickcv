from pymongo import MongoClient
from flask import current_app, g

_client = None
_db = None


def init_db(app):
    global _client, _db
    _client = MongoClient(app.config["MONGO_URI"])
    _db = _client.get_database()
    app.db = _db
    print(f"[MongoDB] Connected to database: {_db.name}")


def get_db():
    from flask import current_app
    return current_app.db


def close_db(e=None):
    _client.close()
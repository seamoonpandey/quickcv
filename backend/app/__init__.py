import os

from flask import Flask, send_from_directory
from flask_cors import CORS
from app.config import Config
from app.extensions import bcrypt, login_manager
from app.database.mongo import init_db


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    upload_dir = app.config.get("UPLOAD_DIR")
    if upload_dir:
        os.makedirs(upload_dir, exist_ok=True)

    # Extensions
    origins = [o.strip() for o in app.config.get("CORS_ORIGINS", "").split(",") if o.strip()]
    CORS(app, supports_credentials=True, origins=origins)
    bcrypt.init_app(app)
    login_manager.init_app(app)

    # Database
    init_db(app)

    # Blueprints
    from app.routes.health_routes import health_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.cv_routes import cv_bp
    from app.routes.user_routes import user_bp
    from app.routes.upload_routes import upload_bp

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(cv_bp, url_prefix="/api/cvs")
    app.register_blueprint(user_bp, url_prefix="/api/user")
    app.register_blueprint(upload_bp, url_prefix="/api/uploads")

    @app.get("/uploads/<path:filename>")
    def uploaded_file(filename):
        return send_from_directory(app.config["UPLOAD_DIR"], filename)

    return app
from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.extensions import bcrypt, login_manager
from app.database.mongo import init_db


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Extensions
    CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5500", "http://localhost:5500"])
    bcrypt.init_app(app)
    login_manager.init_app(app)

    # Database
    init_db(app)

    # Blueprints
    from app.routes.health_routes import health_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.cv_routes import cv_bp
    from app.routes.user_routes import user_bp

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(cv_bp, url_prefix="/api/cvs")
    app.register_blueprint(user_bp, url_prefix="/api/user")

    return app
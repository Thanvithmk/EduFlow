from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

jwt = JWTManager()
bcrypt = Bcrypt()
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # Config
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost:5432/eduflow_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'your_secret_key_here'
    app.config.setdefault("JWT_SECRET_KEY", os.environ.get("JWT_SECRET_KEY") or app.config["SECRET_KEY"])

    # Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/*": {
    "origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://[::1]:5173"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Origin"]
}}, supports_credentials=True)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Import models
    from app.models.user_model import User
    from app.models.task_model import Task
    from app.models.fixed_model import FixedCommitment
    from app.models.schedule_model import Schedule

    from app.routes.auth_routes import auth_bp
    from app.routes.task_routes import tasks_bp
    from app.routes.fixed_routes import fixed_bp
    from app.routes.task_routes import tasks_ml_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(fixed_bp)
    app.register_blueprint(tasks_ml_bp)
    return app
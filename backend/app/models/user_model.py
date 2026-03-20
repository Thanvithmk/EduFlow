from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    tasks = db.relationship("Task", backref="user", lazy=True)
    fixed_commitments = db.relationship("FixedCommitment", backref="user", lazy=True)
    schedules = db.relationship("Schedule", backref="user", lazy=True)
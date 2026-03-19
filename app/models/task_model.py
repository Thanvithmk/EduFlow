from app import db
from datetime import datetime

class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    title = db.Column(db.String(200), nullable=False)
    task_type = db.Column(db.String(50), nullable=False)
    subject = db.Column(db.String(100), nullable=False)

    complexity = db.Column(db.Integer, nullable=False)
    size_metric = db.Column(db.Integer, nullable=False)
    team_size = db.Column(db.Integer, nullable=False)

    days_until_due = db.Column(db.Integer, nullable=False)
    predicted_hours = db.Column(db.Float, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
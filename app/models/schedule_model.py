from app import db
from datetime import datetime

class Schedule(db.Model):
    __tablename__ = "schedules"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    date = db.Column(db.Date, nullable=False)

    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)

    title = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(50))  # study / break / fixed

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
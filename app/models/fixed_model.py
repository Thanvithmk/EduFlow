from app import db
from datetime import datetime

class FixedCommitment(db.Model):
    __tablename__ = "fixed_commitments"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    title = db.Column(db.String(150), nullable=False)

    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)

    type = db.Column(db.String(50))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
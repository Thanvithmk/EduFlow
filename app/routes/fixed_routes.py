from __future__ import annotations

from flask import Blueprint, jsonify, request
from app.utils.jwt_utils import get_user_id_from_request
from app import db
from app.models.fixed_model import FixedCommitment
from datetime import datetime
import time


fixed_bp = Blueprint("fixed", __name__)


@fixed_bp.post("/fixed_commitments")
def save_fixed():
    data = request.get_json(silent=True) or {}

    title = (data.get("title") or "").strip()
    start_time = (data.get("start_time") or "").strip()
    end_time = (data.get("end_time") or "").strip()
    type = (data.get("type") or "").strip()

    if (
        not title
        or not start_time
        or not end_time
        or not type
    ):
        return jsonify({"message": "Missing required fields"}), 400

    try:
    # Use datetime.strptime then call .time() to get a time object
        start_time = datetime.strptime(start_time, "%H:%M").time()
        end_time = datetime.strptime(end_time, "%H:%M").time()
    except (TypeError, ValueError):
        return jsonify({"message": "Invalid time format. Use HH:MM"}), 400
    user_id = get_user_id_from_request()

    if user_id is None:
        return jsonify({"message": "Invalid or missing token"}), 401 # Unauthorized

    fixed = FixedCommitment(
        user_id=user_id,
        title=data["title"],
        start_time=start_time,
        end_time=end_time,
        type=type,
    )

    db.session.add(fixed)
    db.session.commit()

    return jsonify({"message": "Fixed commitment created successfully"}), 201


@fixed_bp.get("/fixed_commitments")
def get_fixed_commitments():
    user_id = get_user_id_from_request()
    if user_id is None:
        return jsonify({"message": "Invalid or missing token"}), 401 
        
    fixed_commitments = FixedCommitment.query.filter_by(user_id=user_id).all()
    result = []
    
    for fixed_commitment in fixed_commitments:
        result.append({
            "id": fixed_commitment.id,
            "title": fixed_commitment.title,
            # Format time objects to strings like "09:00"
            "start_time": fixed_commitment.start_time.strftime("%H:%M") if fixed_commitment.start_time else None,
            "end_time": fixed_commitment.end_time.strftime("%H:%M") if fixed_commitment.end_time else None,
            "type": fixed_commitment.type
        })

    return jsonify(result), 200



@fixed_bp.delete("/fixed_commitments/<int:fixed_commitment_id>")
def delete_fixed(fixed_commitment_id: int):
    user_id = get_user_id_from_request()

    fixed_commitment = FixedCommitment.query.filter_by(id=fixed_commitment_id, user_id=user_id).first()

    if not fixed_commitment:
        return jsonify({"error": "Fixed commitment not found"}), 404

    db.session.delete(fixed_commitment)
    db.session.commit()

    return jsonify({"message": "Fixed commitment deleted successfully"}), 200


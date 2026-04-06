from flask import Blueprint, request, jsonify
from datetime import datetime
from app.services.schedule_service import generate_schedule
from app.utils.jwt_utils import get_user_id_from_request

schedule_bp = Blueprint("schedule", __name__)

@schedule_bp.route("/generate-schedule", methods=["POST"])
def generate_schedule_route():
    try:
        # 🔐 Step 1 — Get user_id (already handled internally)
        user_id = get_user_id_from_request()

        if not user_id:
            return jsonify({
                "success": False,
                "message": "Unauthorized"
            }), 401

        # 📥 Step 2 — Get request data
        data = request.get_json()

        if not data or "start_date" not in data:
            return jsonify({
                "success": False,
                "message": "Start date is required"
            }), 400

        # 📅 Step 3 — Parse date
        try:
            start_date = datetime.strptime(
                data["start_date"], "%Y-%m-%d"
            ).date()
        except ValueError:
            return jsonify({
                "success": False,
                "message": "Invalid date format. Use YYYY-MM-DD"
            }), 400

        # ⚙️ Step 4 — Call scheduler service
        result = generate_schedule(user_id, start_date)

        if not result.get("schedule"):
            return jsonify({
            "success": True,
            "warning": "No tasks found to schedule",
            "data": []
            }), 200

        # 📤 Step 5 — Return response
        return jsonify({
            "success": True,
            "warning": result.get("warning"),
            "data": result.get("schedule")
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
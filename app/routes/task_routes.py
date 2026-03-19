from __future__ import annotations

from flask import Blueprint, jsonify, request
from app.utils.jwt_utils import get_user_id_from_request
from app import db
from app.models.task_model import Task

from app.services.task_service import (
    create_task,
    delete_task_for_user,
    get_tasks_for_user,
)


tasks_bp = Blueprint("tasks", __name__)


@tasks_bp.post("/tasks")
def save_task():
    data = request.get_json(silent=True) or {}

    title = (data.get("title") or "").strip()
    task_type = (data.get("task_type") or "").strip()
    subject = (data.get("subject") or "").strip()
    complexity = data.get("complexity")
    size_metric = data.get("size_metric")
    team_size = data.get("team_size")
    days_until_due = data.get("days_until_due")
    predicted_hours = data.get("predicted_hours")

    if (
        not title
        or not task_type
        or not subject
        or complexity is None
        or size_metric is None
        or team_size is None
        or days_until_due is None
        or predicted_hours is None
    ):
        return jsonify({"message": "Missing required fields"}), 400

    try:
        complexity = int(complexity)
        size_metric = int(size_metric)
        team_size = int(team_size)
        days_until_due = int(days_until_due)
        predicted_hours = float(predicted_hours)
    except (TypeError, ValueError):
        return jsonify({"message": "Invalid field types"}), 400

    user_id = get_user_id_from_request()

    if user_id is None:
        return jsonify({"message": "Invalid or missing token"}), 401 # Unauthorized

    task = Task(
        user_id=user_id,
        title=data["title"],
        task_type=data["task_type"],
        subject=data["subject"],
        complexity=data["complexity"],
        size_metric=data["size_metric"],
        team_size=data["team_size"],
        days_until_due=data["days_until_due"],
        predicted_hours=data["predicted_hours"]
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({"message": "Task created successfully"}), 201


@tasks_bp.get("/tasks")
def get_tasks():
    user_id = get_user_id_from_request()
    if user_id is None:
        return jsonify({"message": "Invalid or missing token"}), 401 # Unauthorized
    tasks = Task.query.filter_by(user_id=user_id).all()
    result = []
    for task in tasks:
        result.append({
            "id": task.id,
            "title": task.title,
            "subject": task.subject,
            "predicted_hours": task.predicted_hours,
            "days_until_due": task.days_until_due
        })

    return jsonify(result), 200



@tasks_bp.delete("/tasks/<int:task_id>")
def delete_task(task_id: int):
    user_id = get_user_id_from_request()

    task = Task.query.filter_by(id=task_id, user_id=user_id).first()

    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted"}), 200


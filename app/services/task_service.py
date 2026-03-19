from __future__ import annotations

from typing import Iterable, Optional

from app import db
from app.models.task_model import Task


def create_task(
    *,
    user_id: int,
    title: str,
    task_type: str,
    subject: str,
    complexity: int,
    size_metric: int,
    team_size: int,
    days_until_due: int,
    predicted_hours: float,
) -> Task:
    task = Task(
        user_id=user_id,
        title=title,
        task_type=task_type,
        subject=subject,
        complexity=complexity,
        size_metric=size_metric,
        team_size=team_size,
        days_until_due=days_until_due,
        predicted_hours=predicted_hours,
    )

    db.session.add(task)
    db.session.commit()

    return task


def get_tasks_for_user(*, user_id: int) -> Iterable[Task]:
    return Task.query.filter_by(user_id=user_id).order_by(Task.created_at.desc()).all()


def delete_task_for_user(*, user_id: int, task_id: int) -> bool:
    task: Optional[Task] = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return False

    db.session.delete(task)
    db.session.commit()
    return True


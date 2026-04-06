from datetime import datetime, timedelta, time
from app import db
from app.models.task_model import Task
from app.models.fixed_model import FixedCommitment
from app.models.schedule_model import Schedule


# 🔵 Helper: subtract slots
def subtract_slots(slots, start, end):
    result = []

    for s, e in slots:
        if end <= s or start >= e:
            result.append((s, e))
        else:
            if s < start:
                result.append((s, start))
            if end < e:
                result.append((end, e))

    return result


# 🔵 Helper: handle overnight commitments (IMPORTANT FIX)
def normalize_commitment(c):
    if c.end_time <= c.start_time:
        return [
            (c.start_time, time(23, 59)),
            (time(0, 0), c.end_time)
        ]
    return [(c.start_time, c.end_time)]


# 🔵 Helper: compute daily free hours
def compute_daily_free_hours(commitments):
    total_minutes = 24 * 60

    for c in commitments:
        start = c.start_time
        end = c.end_time

        minutes = (end.hour * 60 + end.minute) - (start.hour * 60 + start.minute)

        # handle overnight
        if minutes < 0:
            minutes += 24 * 60

        total_minutes -= minutes

    return total_minutes / 60


# 🔥 MAIN FUNCTION
def generate_schedule(user_id, start_date):

    # STEP 1 — Fetch data
    tasks = Task.query.filter_by(user_id=user_id).all()
    commitments = FixedCommitment.query.filter_by(user_id=user_id).all()

    if not tasks:
        return {"schedule": [], "warning": None}

    # STEP 2 — Preprocess tasks
    for task in tasks:
        task.deadline = start_date + timedelta(days=task.days_until_due)
        task.remaining = float(task.predicted_hours)

    # STEP 3 — Planning window
    latest_deadline = max(task.deadline for task in tasks)

    # STEP 4 — Compute available time
    num_days = (latest_deadline - start_date).days + 1
    daily_free = compute_daily_free_hours(commitments)
    total_available = num_days * daily_free

    # STEP 5 — Required time
    total_required = sum(task.remaining for task in tasks)

    # STEP 6 — Rescaling
    warning = None

    if total_required > total_available:
        ratio = total_available / total_required

        for task in tasks:
            task.remaining *= ratio

        warning = "Not enough time. Tasks rescaled proportionally."

    # STEP 7 — Sort by deadline (EDF)
    tasks.sort(key=lambda t: t.deadline)

    # STEP 8 — Scheduling
    schedule = []
    current_date = start_date
    MAX_BLOCK = 3

    while current_date <= latest_deadline:

        free_slots = [(time(0, 0), time(23, 59))]

        # ✅ subtract commitments (FIXED)
        for c in commitments:
            parts = normalize_commitment(c)
            for start, end in parts:
                free_slots = subtract_slots(free_slots, start, end)

        # allocate tasks
        for task in tasks:

            if task.remaining <= 0:
                continue

            if current_date > task.deadline:
                continue

            i = 0
            while i < len(free_slots):

                slot_start, slot_end = free_slots[i]

                start_dt = datetime.combine(current_date, slot_start)
                end_dt = datetime.combine(current_date, slot_end)

                slot_hours = (end_dt - start_dt).total_seconds() / 3600

                if slot_hours <= 0:
                    i += 1
                    continue

                allocate = min(slot_hours, task.remaining, MAX_BLOCK)

                if allocate <= 0:
                    i += 1
                    continue

                new_end_dt = start_dt + timedelta(hours=allocate)

                # 🚫 prevent crossing midnight
                if new_end_dt.date() != current_date:
                    new_end_dt = datetime.combine(current_date, time(23, 59))

                # ✅ study block
                schedule.append({
                    "date": current_date,
                    "start_time": slot_start.strftime("%H:%M"),
                    "end_time": new_end_dt.time().strftime("%H:%M"),
                    "title": task.title.strip(),
                    "type": "study"
                })

                task.remaining -= allocate
                new_start_time = new_end_dt.time()

                # ✅ update slot safely
                if new_start_time >= slot_end:
                    free_slots.pop(i)
                    continue
                else:
                    free_slots[i] = (new_start_time, slot_end)

                # ✅ break handling
                if allocate >= 2:
                    break_end_dt = new_end_dt + timedelta(minutes=15)

                    if break_end_dt.date() != current_date:
                        break_end_dt = datetime.combine(current_date, time(23, 59))

                    schedule.append({
                        "date": current_date,
                        "start_time": new_start_time.strftime("%H:%M"),
                        "end_time": break_end_dt.time().strftime("%H:%M"),
                        "title": "Break",
                        "type": "break"
                    })

                    if break_end_dt.time() >= slot_end:
                        free_slots.pop(i)
                        continue
                    else:
                        free_slots[i] = (break_end_dt.time(), slot_end)

                if task.remaining <= 0:
                    break

                i += 1

        current_date += timedelta(days=1)

    # 🔵 STEP 9 — Save to DB
    Schedule.query.filter(
        Schedule.user_id == user_id,
        Schedule.date >= start_date,
        Schedule.date <= latest_deadline
    ).delete()

    for s in schedule:
        db.session.add(Schedule(
            user_id=user_id,
            date=s["date"],
            start_time=datetime.strptime(s["start_time"], "%H:%M").time(),
            end_time=datetime.strptime(s["end_time"], "%H:%M").time(),
            title=s["title"],
            type=s["type"]
        ))

    db.session.commit()

    # 🔵 STEP 10 — SORT (IMPORTANT FIX)
    schedule.sort(key=lambda x: (x["date"], x["start_time"]))

    return {
        "schedule": schedule,
        "warning": warning
    }
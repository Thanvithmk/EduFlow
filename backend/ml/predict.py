import joblib
import numpy as np
import os

# Define static mappings inside predict.py [cite: 36, 38]
TASK_TYPE_MAPPING = {
    "programming": 0, "research": 1, "presentation": 2, 
    "lab_work": 3, "exam_preparation": 4, "project": 5
}
SUBJECT_MAPPING = {
    "machine_learning": 0, "computer_science": 1, "data_science": 2, 
    "software_engineering": 3, "web_development": 4, "database_systems": 5, "mathematics": 6
}

# Load model once at startup [cite: 60, 62, 63]
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.joblib")
model = joblib.load(MODEL_PATH)

def get_prediction(task_data: dict) -> float:
    """Internal logic to encode features and run inference[cite: 68]."""
    # 1. Encoding Logic [cite: 40, 41]
    encoded_vector = [
        TASK_TYPE_MAPPING[task_data["task_type"]],
        SUBJECT_MAPPING[task_data["subject"]],
        int(task_data["complexity"]),
        int(task_data["size_metric"]),
        int(task_data["team_size"]),
        int(task_data["days_until_due"])
    ]

    features = np.array([encoded_vector])
    prediction = model.predict(features)    

    return round(float(prediction[0]), 1)
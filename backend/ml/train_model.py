import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

# 1. Define Mappings (Must match predict.py exactly) [cite: 36, 38]
TASK_TYPE_MAPPING = {
    "programming": 0, "research": 1, "presentation": 2, 
    "lab_work": 3, "exam_preparation": 4, "project": 5
}
SUBJECT_MAPPING = {
    "machine_learning": 0, "computer_science": 1, "data_science": 2, 
    "software_engineering": 3, "web_development": 4, "database_systems": 5, "mathematics": 6
}

def train_engine():
    # Load dataset [cite: 46, 53]
    df = pd.read_csv("tasks_data.csv", encoding='latin1')
    # Encode categorical columns [cite: 47, 53]
    df['task_type'] = df['task_type'].map(TASK_TYPE_MAPPING)
    df['subject'] = df['subject'].map(SUBJECT_MAPPING)

    # Split features (X) and target (y) [cite: 53]
    X = df[['task_type', 'subject', 'complexity', 'size_metric', 'team_size', 'days_until_due']]
    y = df['actual_hours']

    # Initialize Model with your exact specs [cite: 55]
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=15,
        min_samples_split=5,
        random_state=42
    )

    # Train the model [cite: 49, 53]
    model.fit(X, y)

    # Save the model to a file [cite: 51, 57]
    joblib.dump(model, "model.joblib")
    print("✅ model.joblib has been created successfully!")

if __name__ == "__main__":
    train_engine()
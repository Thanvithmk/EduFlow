import json
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
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

    # Train/test split for evaluation
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Initialize Model with your exact specs [cite: 55]
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=15,
        min_samples_split=5,
        random_state=42
    )

    # Train the model [cite: 49, 53]
    model.fit(X_train, y_train)

    # Evaluate on test set
    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    mse = mean_squared_error(y_test, preds)
    rmse = mse ** 0.5
    r2 = r2_score(y_test, preds)

    metrics = {
        'MAE': round(float(mae), 4),
        'MSE': round(float(mse), 4),
        'RMSE': round(float(rmse), 4),
        'R2': round(float(r2), 4),
        'n_train': int(X_train.shape[0]),
        'n_test': int(X_test.shape[0])
    }

    # Save metrics to JSON
    with open('metrics.json', 'w', encoding='utf-8') as mf:
        json.dump(metrics, mf, indent=2)

    # Save the model to a file [cite: 51, 57]
    joblib.dump(model, "model.joblib")
    print("✅ model.joblib has been created successfully!")
    print("📊 Evaluation metrics:", metrics)

if __name__ == "__main__":
    train_engine()
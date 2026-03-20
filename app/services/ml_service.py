from ml.predict import get_prediction # Import the logic from your ML folder

def predict_time(task_data):
    """
    Acts as the service bridge. 
    It doesn't need the mappings here because predict.py has them.
    """
    try:
        return get_prediction(task_data)
    except KeyError as e:
        raise ValueError(f"Invalid input category: {str(e)}")
    except Exception as e:
        raise e
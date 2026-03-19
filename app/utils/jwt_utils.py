import jwt
from flask import request, current_app

def get_user_id_from_request():
    try:
        # 1. Get the "Authorization" header
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None

        # 2. Extract the token (Remove "Bearer " prefix)
        token = auth_header.split(" ")[1]

        # 3. Decode using the app's Secret Key
        # We use "sub" because flask-jwt-extended puts the ID there
        decoded = jwt.decode(
            token, 
            current_app.config["JWT_SECRET_KEY"], 
            algorithms=["HS256"]
        )
        
        return decoded["sub"]

    except Exception as e:
        print(f"JWT Error: {e}")
        return None
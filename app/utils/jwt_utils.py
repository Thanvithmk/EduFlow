import jwt
from flask import request

SECRET_KEY = "your_secret_key_here"

def get_user_id_from_request():
    try:
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return None

        token = auth_header.split(" ")[1]

        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded["user_id"]

    except:
        return None
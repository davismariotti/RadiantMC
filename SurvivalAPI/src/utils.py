from flask import jsonify, request, abort
import os

api_key = os.environ['API_KEY']


def create_error(error):
    return jsonify({"error": error, "status": "error"})


def create_success(payload):
    return jsonify({"status": "success", "payload": payload})


def check_token():
    if "Authorization" not in request.headers:
        abort(401)

    bearer = request.headers["Authorization"].replace("Bearer ", "")
    if bearer != api_key:
        abort(403)

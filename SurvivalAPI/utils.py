from flask import jsonify, request, abort

from app import api_key


def create_errors(errors):
    return jsonify({"errors": errors, "status": "error"})


def create_success(payload):
    return jsonify({"status": "success", "payload": payload})


def check_token():
    if "Authorization" not in request.headers:
        abort(401)

    bearer = request.headers["Authorization"].replace("Bearer ", "")
    if bearer != api_key:
        abort(403)

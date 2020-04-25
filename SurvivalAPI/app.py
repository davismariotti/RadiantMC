from flask import Flask
from flask import jsonify, request, abort
import os

from twilio.rest import Client

app = Flask(__name__)

auth_token = os.environ['AUTH_TOKEN']
account_sid = os.environ['ACCOUNT_SID']
api_key = os.environ['API_KEY']

client = Client(account_sid, auth_token)


def check_token():
    if "Authorization" not in request.headers:
        abort(401)

    bearer = request.headers["Authorization"].replace("Bearer ", "")
    if bearer != api_key:
        abort(403)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/send/<phone>', methods=['POST'])
def send(phone):
    check_token()
    req_json = request.get_json()
    if req_json is None or 'logged_in_name' not in req_json:
        return create_errors(['There was no player name supplied'])
    logged_in_name = request.get_json()['logged_in_name']
    if len(phone) != 10:
        return create_errors(['The phone number must be 10 digits long'])

    message = client.messages \
        .create(
        body="%s logged in" % logged_in_name,
        from_='+18634171351',
        to='+1%s' % phone
    )
    return create_success(convert_message(message))


def convert_message(message):
    return {
        "body": message.body,
        "sid": message.sid,
        "to": message.to,
        "date_created": message.date_created
    }


def create_errors(errors):
    return jsonify({"errors": errors, "status": "error"})


def create_success(payload):
    return jsonify({"status": "success", "payload": payload})


if __name__ == '__main__':
    app.run()

from flask import Blueprint, request
from sqlalchemy import and_
from twilio.rest import Client

from models import Mobile
from utils import create_success, check_token
import os


auth_token = os.environ['AUTH_TOKEN']
account_sid = os.environ['ACCOUNT_SID']
from_phone_number = os.environ['FROM_PHONE_NUMBER']

login_api = Blueprint('login_api', __name__)

client = Client(account_sid, auth_token)


@login_api.route('/login/<username>', methods=['POST'])
def send(username):
    check_token()

    excluded_players = []
    req_json = request.get_json()
    if req_json is not None and 'excludedPlayers' in req_json:
        excluded_players = req_json['excludedPlayers']

    mobile_records = Mobile.query.filter(and_(Mobile.minecraft_username.notin_(excluded_players), Mobile.minecraft_username != username)).all()

    messages = []
    for mobile_record in mobile_records:
        messages.append(client.messages.create(
            body="%s logged in" % username,
            from_=from_phone_number,
            to=mobile_record.mobile
        ))
    return create_success(list(map(convert_message, messages)))


def convert_message(message):
    return {
        "body": message.body,
        "sid": message.sid,
        "to": message.to,
        "date_created": message.date_created
    }


if __name__ == '__main__':
    pass

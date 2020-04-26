from flask import Blueprint, request
from twilio.rest import Client
from utils import create_success, create_error, check_token
import os


auth_token = os.environ['AUTH_TOKEN']
account_sid = os.environ['ACCOUNT_SID']
from_phone_number = os.environ['FROM_PHONE_NUMBER']

login_api = Blueprint('login_api', __name__)

client = Client(account_sid, auth_token)


@login_api.route('/send/<phone>', methods=['POST'])
def send(phone):
    check_token()
    req_json = request.get_json()
    if req_json is None or 'logged_in_name' not in req_json:
        return create_error('There was no player name supplied')
    logged_in_name = req_json['logged_in_name']
    if len(phone) != 10:
        return create_error('The phone number must be 10 digits long')

    message = client.messages \
        .create(
        body="%s logged in" % logged_in_name,
        from_=from_phone_number,
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


if __name__ == '__main__':
    pass

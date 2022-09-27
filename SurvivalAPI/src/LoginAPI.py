from flask import Blueprint, request
from sqlalchemy import and_, func
from twilio.rest import Client
from models import Mobile
from utils import create_success, check_token, create_error
from pushover import send_pushover_message
from datetime import datetime
import os
import pytz
import json
import requests

auth_token = os.environ['AUTH_TOKEN']
account_sid = os.environ['ACCOUNT_SID']
from_phone_number = os.environ['FROM_PHONE_NUMBER']

login_api = Blueprint('login_api', __name__)

client = Client(account_sid, auth_token)


@login_api.route('/login/<uuid>', methods=['POST'])
def send(uuid):
    check_token()

    excluded_players = []
    req_json = request.get_json()
    if req_json is not None and 'excludedPlayers' in req_json:
        excluded_players = req_json['excludedPlayers']

    mobile_records = Mobile.query.filter(and_(Mobile.id.notin_(excluded_players), Mobile.id != uuid)).all()

    # Get their minecraft username
    r = requests.get('https://sessionserver.mojang.com/session/minecraft/profile/%s' % str(uuid).replace('-', ''))

    if r.status_code == 204:
        return create_error('That minecraft username does not exist.')

    json_response = r.json()
    name = json_response['name']

    now = datetime.utcnow().replace(tzinfo=pytz.utc).astimezone(pytz.timezone("America/Los_Angeles"))
    weekday = now.weekday()
    hour = now.hour
    messages = []
    for mobile_record in mobile_records:
        time_slots = json.loads(mobile_record.time_slots)
        if is_inside_valid_time_slot(time_slots, weekday, hour):
            if mobile_record.use_pushover:
                r = send_pushover_message("%s logged in" % name)
                messages.append({
                    "to": "pushover",
                    "request": r["request"],
                    "date_created": str(datetime.now())
                })
            else:
                messages.append(convert_message(client.messages.create(
                    body="%s logged in" % name,
                    from_=from_phone_number,
                    to=mobile_record.mobile
                )))

    return create_success(messages)


def is_inside_valid_time_slot(time_slots, weekday, hour):
    for day_slot in time_slots:
        day = day_slot["day"]
        if weekday != day:
            continue
        hour_slots = day_slot["slots"]
        for hour_slot in hour_slots:
            start_hour = hour_slot['start_time']
            end_hour = hour_slot['end_time']
            if start_hour <= hour <= end_hour:
                return True
    return False


def convert_message(message):
    return {
        "body": message.body,
        "sid": message.sid,
        "to": message.to,
        "date_created": message.date_created
    }

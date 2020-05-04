from flask import Blueprint, request
from sqlalchemy import and_, func
from twilio.rest import Client
from models import Mobile
from utils import create_success, check_token, create_error
import os
import datetime
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
    # https://api.mojang.com/user/profiles/6cffa9a7-18de-45df-a374-3d2f8a2b0562/names
    r = requests.get('https://api.mojang.com/user/profiles/%s/names' % str(uuid).replace('-', ''))

    if r.status_code == 204:
        return create_error('That minecraft username does not exist.')

    json_response = r.json()
    name = json_response[-1]['name']

    now = datetime.datetime.utcnow().replace(tzinfo=pytz.utc).astimezone(pytz.timezone("America/Los_Angeles"))
    weekday = now.weekday()
    hour = now.hour
    messages = []
    for mobile_record in mobile_records:
        time_slots = json.loads(mobile_record.time_slots)
        if is_inside_valid_time_slot(time_slots, weekday, hour):
            messages.append(client.messages.create(
                body="%s logged in" % name,
                from_=from_phone_number,
                to=mobile_record.mobile
            ))
    return create_success(list(map(convert_message, messages)))


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

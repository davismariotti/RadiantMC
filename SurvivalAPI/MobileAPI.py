import re
import json
from flask import Blueprint, request
from sqlalchemy import or_

from extensions import db
from models import Mobile
from utils import create_success, create_error

mobile_api = Blueprint('mobile_api', __name__)


def validate_phone_number(mobile):
    return re.search(r'^\+1\d{10}$', mobile)


def check_if_mobile_or_username_exists(mobile, minecraft_username):
    return db.session.query(Mobile.minecraft_username).filter(
        or_(Mobile.mobile == mobile, Mobile.minecraft_username == minecraft_username)).count() > 0


@mobile_api.route('/mobile/<phone>', methods=['GET'])
def get_phone(phone):
    mobile_rec = Mobile.query.filter(Mobile.mobile == phone).first_or_404()

    return create_success(convert_mobile(mobile_rec))


@mobile_api.route('/user/<mobile_id>', methods=['GET'])
def get_id(mobile_id):
    mobile_rec = Mobile.query.filter(Mobile.id == mobile_id).first_or_404()

    return create_success(convert_mobile(mobile_rec))


@mobile_api.route('/username/<username>', methods=['GET'])
def get_username(username):
    mobile_rec = Mobile.query.filter(Mobile.minecraft_username == username).first_or_404()

    return create_success(convert_mobile(mobile_rec))


@mobile_api.route('/mobile/new', methods=['POST'])
def create_mobile():
    req_json = request.get_json()
    if req_json is None or 'mobile' not in req_json or 'minecraft_username' not in req_json:
        return create_error('There was no mobile or minecraft username supplied.')

    mobile = req_json['mobile']
    minecraft_username = req_json['minecraft_username']

    if not validate_phone_number(mobile):
        return create_error('The mobile number is invalid.')

    if check_if_mobile_or_username_exists(mobile, minecraft_username):
        return create_error('There is already a record with that mobile/username.')

    mobile_rec = Mobile(mobile=mobile, minecraft_username=minecraft_username, time_slots=[])
    db.session.add(mobile_rec)
    db.session.commit()
    return convert_mobile(mobile_rec)


@mobile_api.route('/time_slots/<mobile_id>/update', methods=['POST'])
def update_time_slots(mobile_id):
    mobile_rec = Mobile.query.filter(Mobile.id == mobile_id).first_or_404()
    req_json = request.get_json()
    if req_json is None or 'time_slots' not in req_json:
        return create_error('There were no time slots supplied.')

    time_slots = req_json['time_slots']
    print(time_slots)

    mobile_rec.time_slots = json.dumps(time_slots)
    db.session.commit()

    return create_success(convert_mobile(mobile_rec))


@mobile_api.route('/mobile/list')
def list_mobiles():
    mobiles = Mobile.query.all()
    return create_success(list(map(convert_mobile, mobiles)))


def convert_mobile(mobile):
    return {
        'id': mobile.id,
        'mobile': mobile.mobile,
        'minecraft_username': mobile.minecraft_username,
        'time_slots': json.loads(mobile.time_slots)
    }


if __name__ == '__main__':
    pass

from flask import Blueprint, request
from sqlalchemy import or_

from extensions import db
from models import Mobile
from utils import create_success, create_errors

mobile_api = Blueprint('mobile_api', __name__)


def check_if_mobile_or_username_exists(mobile, minecraft_username):
    return db.session.query(Mobile.minecraft_username).filter(or_(Mobile.mobile == mobile, Mobile.minecraft_username == minecraft_username)).count() > 0


@mobile_api.route('/mobile/new', methods=['POST'])
def create_mobile():
    req_json = request.get_json()
    if req_json is None or 'mobile' not in req_json or 'minecraft_username' not in req_json:
        return create_errors(['There was no mobile or minecraft username supplied.'])

    mobile = req_json['mobile']
    minecraft_username = req_json['minecraft_username']

    if check_if_mobile_or_username_exists(mobile, minecraft_username):
        return create_errors(['There is already a record with that mobile/username.'])

    mobile_rec = Mobile(mobile=mobile, minecraft_username=minecraft_username)
    db.session.add(mobile_rec)
    db.session.commit()
    return convert_mobile(mobile_rec)


@mobile_api.route('/mobile/list')
def list_mobiles():
    mobiles = Mobile.query.all()
    return create_success(list(map(convert_mobile, mobiles)))


def convert_mobile(mobile):
    return {
        'id': mobile.id,
        'mobile': mobile.mobile,
        'minecraft_username': mobile.minecraft_username
    }


if __name__ == '__main__':
    pass

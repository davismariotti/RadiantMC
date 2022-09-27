from flask import Flask
import os

from LoginAPI import login_api
from MobileAPI import mobile_api
from extensions import db

database_url = os.environ['DATABASE_URL']

app = Flask(__name__)
app.register_blueprint(mobile_api)
app.register_blueprint(login_api)
app.config.update(
    SQLALCHEMY_DATABASE_URI=database_url,
    SQLALCHEMY_TRACK_MODIFICATIONS=False
)
db.init_app(app)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050)

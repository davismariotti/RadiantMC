from flask import Flask
import os
from MobileAPI import mobile_api
from extensions import db

database_url = os.environ['DATABASE_URL']

app = Flask(__name__)
app.register_blueprint(mobile_api)
app.config.update(
    SQLALCHEMY_DATABASE_URI=database_url,
    SQLALCHEMY_TRACK_MODIFICATIONS=False
)
db.init_app(app)


@app.route('/')
def hello_world():
    return 'Hello World!'


if __name__ == '__main__':
    app.run()

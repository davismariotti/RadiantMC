import requests
import os

USER_KEY = os.environ['PUSHOVER_USER_KEY']
APP_KEY = os.environ['PUSHOVER_APP_KEY']


def send_pushover_message(message):
    r = requests.post("https://api.pushover.net/1/messages.json", {
        "token": APP_KEY,
        "user": USER_KEY,
        "message": message,
        "url": "https://map.davismariotti.com",
    })
    print(r)
    return r.json()

from extensions import db


class Mobile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mobile = db.Column(db.String(64), index=True, unique=True)
    minecraft_username = db.Column(db.String(120), index=True, unique=True)

    def __repr__(self):
        return '<Mobile {}>'.format(self.mobile)


class TimeSlot(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mobile_id = db.Column(db.Integer, db.ForeignKey('mobile.id'))
    start_hour = db.Column(db.Integer)
    end_hour = db.Column(db.Integer)
    day = db.Column(db.String(64))

    def __repr__(self):
        return '<TimeSlot {}>'.format(self.body)

from extensions import db


class Mobile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mobile = db.Column(db.String(64), index=True, unique=True)
    minecraft_username = db.Column(db.String(120), index=True, unique=True)
    time_slots = db.Column(db.Text)

    def __repr__(self):
        return '<Mobile {} {}>'.format(self.minecraft_username, self.mobile)

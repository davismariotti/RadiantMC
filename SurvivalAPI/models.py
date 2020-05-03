from extensions import db
from sqlalchemy.dialects.postgresql import UUID


class Mobile(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True)
    mobile = db.Column(db.String(64), index=True)
    minecraft_username = db.Column(db.String(120), index=True, unique=True)
    time_slots = db.Column(db.Text)

    def __repr__(self):
        return '<Mobile {} {}>'.format(self.minecraft_username, self.mobile)

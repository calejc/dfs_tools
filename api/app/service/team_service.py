from app import app
from app.model.models import *


def get_teams():
    with app.app_context():
        return db.session.query(TeamEntity).all()

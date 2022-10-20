from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from app.config.encoder import CustomJSONEncoder
from config import Config
from app.model.models import *


class CustomFlaskInstance(Flask):
    json_encoder = CustomJSONEncoder


app = CustomFlaskInstance(__name__)
app.config.from_object(Config)
db.init_app(app)
CORS(app)
with app.app_context():
    db.create_all()
from app.controller import views

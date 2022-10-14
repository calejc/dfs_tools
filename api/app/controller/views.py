from flask import jsonify, request
from app.service.db_service import *
from app.service.team_service import *
from app import app


@app.route("/teams", methods=["POST"])
def teams_post():
    insert_teams()
    return {}


@app.route("/teams")
def teams_get():
    return jsonify(get_teams())


@app.route("/players", methods=["POST"])
def players_post():
    insert_players()
    return {}


@app.route("/upload", methods=["POST"])
def upload_projections():
    pass

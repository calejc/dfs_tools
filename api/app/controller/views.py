from flask import jsonify, request
from app.service.db_service import *
from app.service.team_service import *
from app.service.draftkings_service import *
from app.service.stats_service import *
from app.service.optimize import *
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
    handle_file_upload(
        request.files["file"],
        request.args.get("source"),
        request.args.get("draftGroup"),
    )
    return {}


@app.route("/fetch-draft-groups")
def fetch_new_draft_groups():
    extract_slates()
    return {}

@app.route('/draft-group/<dgid>')
def get_draft_group_with_players(dgid):
    return jsonify(get_draft_group_players(dgid))


@app.route("/upcoming-draft-groups")
def get_upcoming_draft_groups():
    return jsonify(get_draft_groups())


@app.route('/optimize')
def run_optimizer():
    optimize()
    return {}

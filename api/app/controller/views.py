from flask import jsonify, request
from app import app
from app.model.models import (
    OptimizerStackOption,
    OptimizerStackOptions,
    OptimizerConstraintsModel,
)
from app.service.db_service import *
from app.service.draftkings_service import *
from app.service.optimize import *
from app.service.player_service import update_player_entities
from app.service.stats_service import *
from app.service.team_service import *


@app.route("/teams", methods=["POST"])
def teams_post():
    insert_teams()
    return {}


@app.route("/teams")
def teams_get():
    return jsonify(get_teams())


@app.route("/players", methods=["POST"])
def players_post():
    update_player_entities()
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


@app.route("/draft-group/<dgid>")
def get_draft_group_with_players(dgid):
    return jsonify(get_draft_group_data(dgid))


@app.route("/upcoming-draft-groups")
def get_upcoming_draft_groups():
    return jsonify(get_draft_groups())


@app.route("/optimize", methods=["POST"])
def run_optimizer():
    data = request.json["data"]
    stack = data["stack"]
    players = data.get("players", [])
    optimized_resp = optimize(
        OptimizerConstraintsModel(
            draft_group_id=request.args["draftGroup"],
            count=data["count"],
            unique=data["unique"],
            max_per_team=data["max_per_team"],
            flex=data["flex_positions"],
            players=players,
            use_ceiling=data["useCeiling"],
            ownership_constraints=[],
            player_groups=[],
            stack=OptimizerStackOptions(
                with_qb=OptimizerStackOption(
                    stack["WithQB"]["RB"],
                    stack["WithQB"]["WR"],
                    stack["WithQB"]["TE"],
                    stack["WithQB"]["FLEX"],
                    stack["WithQB"]["WRTE"],
                ),
                opp=OptimizerStackOption(
                    stack["Opp"]["RB"],
                    stack["Opp"]["WR"],
                    stack["Opp"]["TE"],
                    stack["Opp"]["FLEX"],
                    stack["Opp"]["WRTE"],
                ),
            ),
        )
    )
    return jsonify(optimized_resp)

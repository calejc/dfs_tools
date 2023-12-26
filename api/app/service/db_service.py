import csv, json
from typing import overload
from app.model.models import *
from app import app


NFL_TEAMS_JSON_FP = "resources/nfl_teams.json"
NFL_TEAMS_NFLFASTR_CSV_FP = "resources/nfl_teams.csv"
NFL_PLAYERS_JSON_FP = "resources/updated_players.json"


def is_relevant_fantasy_player(player_json):
    if player_json.get("fantasy_positions", None) is None:
        return False
    else:
        return any(
            pos in player_json["fantasy_positions"]
            for pos in ["QB", "WR", "RB", "TE", "FB"]
        )


def insert_players():
    with open(NFL_PLAYERS_JSON_FP, "r") as f:
        [to_player_entity(p) for p in json.loads(f.read()).values()]


@overload
def to_player_entity(player_entity: PlayerEntity):
    with app.app_context():
        db.session.add(player_entity)
        db.session.commit()


@overload
def to_player_entity(player_json: dict):
    if is_relevant_fantasy_player(player_json):
        with app.app_context():
            if player_json.get("team", None) is not None:
                player = (
                    db.session.query(PlayerEntity)
                    .filter_by(sleeper_id=player_json["player_id"])
                    .first()
                )
                new_player_entity = PlayerEntity(
                    first_name=player_json["first_name"],
                    last_name=player_json["last_name"],
                    full_name=player_json["full_name"],
                    team=player_json["team"],
                    position=player_json["position"],
                    status=player_json["status"],
                    hashtag=player_json["hashtag"],
                    stats_id=player_json["stats_id"],
                    dk_id=player_json["swish_id"],
                    swish_id=player_json["swish_id"],
                    yahoo_id=player_json["yahoo_id"],
                    rotowire_id=player_json["rotowire_id"],
                    espn_id=player_json["espn_id"],
                    gsis_id=player_json["gsis_id"],
                    rotoworld_id=player_json["rotoworld_id"],
                    fantasy_data_id=player_json["fantasy_data_id"],
                    sportradar_id=player_json["sportradar_id"],
                    sleeper_id=player_json["player_id"],
                )
                if player:
                    new_player_entity.id = player.id
                db.session.merge(new_player_entity)
                # db.session.add(new_player_entity)
                # db.session.commit()


def to_team_entity(team_json, team_csv_row):
    with app.app_context():
        team = db.session.query(TeamEntity).filter_by(dk_abbr=team_json["dk"]).first()
        if not team:
            db.session.add(
                TeamEntity(
                    name=team_json["full"],
                    location=team_json["location"],
                    short_location=team_json["short_location"],
                    nickname=team_json["nickname"],
                    slug=team_json["slug"],
                    team_color=team_csv_row["team_color"],
                    team_color2=team_csv_row["team_color2"],
                    team_color3=team_csv_row["team_color3"],
                    team_color4=team_csv_row["team_color4"],
                    team_logo_wiki=team_csv_row["team_logo_wikipedia"],
                    team_logo_espn=team_csv_row["team_logo_espn"],
                    team_wordmark=team_csv_row["team_wordmark"],
                    nfl_id=team_json["nfl_team_id"],
                    nfl_abbr=team_json["nfl"],
                    dk_id=team_json["dk_id"],
                    dk_abbr=team_json["dk"],
                    pfr_abbr=team_json["pfr"],
                    pff_id=team_json["pff"],
                    pff_abbr=team_json["pfflabel"],
                    fo_abbr=team_json["fo"],
                )
            )
            db.session.commit()
        else:
            print(
                "Team {} exists in the database, not upserting new team data".format(
                    team_json["dk"]
                )
            )


def insert_teams():
    with open(NFL_TEAMS_JSON_FP, "r") as f:
        json_data = json.loads(f.read())
    with open(NFL_TEAMS_NFLFASTR_CSV_FP, "r") as f:
        [to_team_entity(json_data[row["team_abbr"]], row) for row in csv.DictReader(f)]

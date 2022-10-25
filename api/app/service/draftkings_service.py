import requests
from app.model.models import *
from app import app
from datetime import datetime

NFL_CONTESTS_URL = "https://www.draftkings.com/lobby/getcontests?sport=NFL"
DRAFTGROUPS_URL = "https://api.draftkings.com/draftgroups/v1/draftgroups/{}/draftables"
SLEEPER_API_URL = "https://api.sleeper.app/v1/players/nfl"

DRAFTKINGS_DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S"


def to_py_date_time(str):
    return datetime.strptime(str.split(".")[0], DRAFTKINGS_DATETIME_FORMAT)


def is_showdown_game_type(json):
    return json["GameTypeId"] == 96


def is_classic_game_type(json):
    return json["GameTypeId"] == 1


def no_start_time_suffix(json):
    return json["ContestStartTimeSuffix"] is None


def is_featured(json):
    return json["DraftGroupTag"] == "Featured"


def to_game_entity(json, dg_id):
    game = get_entity_by_type_and_id(json["competitionId"], Game)
    return (
        game
        if game
        else Game(
            id=json["competitionId"],
            away=json["awayTeam"]["teamId"],
            home=json["homeTeam"]["teamId"],
            draft_group_id=dg_id,
            start=to_py_date_time(json["startTime"]),
        )
    )


def get_entity_by_type_and_id(id, clazz):
    return db.session.query(clazz).filter_by(id=id).first()


def to_draft_group_player(json, dg_id):
    return DraftGroupPlayer(
        id=json["draftableId"],
        salary=json["salary"],
        player_id=json["playerId"] if json["rosterSlotId"] != 71 else None,
        game_id=json["competition"]["competitionId"],
        team_id=json["teamId"],
        roster_slot_id=json["rosterSlotId"],
        draft_group_id=dg_id,
    )


def draftable_to_player_entity():
    """
    TODO: Insert new player entity when fetching draftgroup player pool, if player entity doesn't exist.
    Note: Query players json data for any position, most likely the player has a fantasy position that we skipped when initially persisting players
    """
    pass


def persist_draft_group_data(dg):
    dg_id = dg["DraftGroupId"]
    if not get_entity_by_type_and_id(dg_id, DraftGroup):
        draft_group = requests.get(DRAFTGROUPS_URL.format(dg_id)).json()
        if draft_group["draftables"]:
            db.session.add(
                DraftGroup(
                    id=dg_id,
                    site=Site.DRAFTKINGS,
                    start=to_py_date_time(dg["StartDate"]),
                    type=SlateType.CLASSIC
                    if is_classic_game_type(dg)
                    else SlateType.SHOWDOWN,
                )
            )

            db.session.add_all(
                [to_game_entity(g, dg_id) for g in draft_group["competitions"]]
            )
            db.session.add_all(
                [to_draft_group_player(p, dg_id) for p in draft_group["draftables"]]
            )
            db.session.commit()


def extract_slates():
    upcoming_slates = [
        draftGroup
        for draftGroup in requests.get(NFL_CONTESTS_URL).json()["DraftGroups"]
        if (is_classic_game_type(draftGroup) and no_start_time_suffix(draftGroup))
        or (is_showdown_game_type(draftGroup) and is_featured(draftGroup))
    ]

    if not upcoming_slates:
        return

    with app.app_context():
        [persist_draft_group_data(dg) for dg in upcoming_slates]


def get_draft_groups():
    return db.session.query(DraftGroup).filter(DraftGroup.start >= datetime.now()).all()

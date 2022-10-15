import requests
from app.model.models import *
from app import app
from datetime import datetime

NFL_CONTESTS_URL = "https://www.draftkings.com/lobby/getcontests?sport=NFL"
DRAFTGROUPS_URL = "https://api.draftkings.com/draftgroups/v1/draftgroups/{}/draftables"

DRAFTKINGS_DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S"


def toPyDateTime(str):
    return datetime.strptime(str.split(".")[0], DRAFTKINGS_DATETIME_FORMAT)


def isShowdownGameType(json):
    return json["GameTypeId"] == 96


def isClassicGameType(json):
    return json["GameTypeId"] == 1


def noStartTimeSuffix(json):
    return json["ContestStartTimeSuffix"] is None


def toGameEntity(json, dg_id):
    return Game(
        id=json["competitionId"],
        away=json["awayTeam"]["teamId"],
        home=json["homeTeam"]["teamId"],
        draft_group_id=dg_id,
        start=toPyDateTime(json["startTime"]),
    )


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
    TODO: Insert new player entity when fetching draftgroup player pool, if player entity doesn't exist
    """
    pass


def extractMainSlate():
    mainSlate = [
        draftGroup
        for draftGroup in requests.get(NFL_CONTESTS_URL).json()["DraftGroups"]
        if isClassicGameType(draftGroup) and noStartTimeSuffix(draftGroup)
    ][0]

    if not mainSlate:
        return

    with app.app_context():
        dg_id = mainSlate["DraftGroupId"]
        draft_group = db.session.query(DraftGroup).filter_by(id=dg_id).first()
        if not draft_group:
            db.session.add(
                DraftGroup(
                    id=dg_id,
                    # site=Site.DRAFTKINGS,
                    start=toPyDateTime(mainSlate["StartDate"]),
                )
            )

            draft_group = requests.get(DRAFTGROUPS_URL.format(dg_id)).json()
            db.session.add_all(
                [toGameEntity(g, dg_id) for g in draft_group["competitions"]]
            )
            db.session.add_all(
                [to_draft_group_player(p, dg_id) for p in draft_group["draftables"]]
            )
            db.session.commit()


def get_draft_groups():
    return db.session.query(DraftGroup).all()

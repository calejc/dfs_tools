import requests
from app.model.models import *
from app import app

NFL_CONTESTS_URL = "https://www.draftkings.com/lobby/getcontests?sport=NFL"
DRAFTGROUPS_URL = "https://api.draftkings.com/draftgroups/v1/draftgroups/{}/draftables"


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
    )


def to_draft_group_player(json, dg_id):
    return DraftGroupPlayer(
        id=json["draftableId"],
        salary=json["salary"],
        player_id=json["playerId"],
        roster_slot_id=json["rosterSlotId"],
        draft_group_id=dg_id,
    )


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
            db.session.add(DraftGroup(id=dg_id))

            draft_group = requests.get(DRAFTGROUPS_URL.format(dg_id)).json()
            print(draft_group)
            db.session.add_all(
                [toGameEntity(g, dg_id) for g in draft_group["competitions"]]
            )
            db.session.add_all(
                [to_draft_group_player(p, dg_id) for p in draft_group["draftables"]]
            )
            db.session.commit()

import requests
from app.model.draftkings_api_constants import *
from app.model.models import *
from app import app
from datetime import datetime, timedelta
from app.service.player_service import update_player_entities


def to_py_date_time(str):
    return datetime.strptime(str.split(".")[0], DRAFTKINGS_DATETIME_FORMAT)


def is_showdown_game_type(json):
    return json[DRAFT_GROUP_GAME_TYPE] == SHOWDOWN


def is_classic_game_type(json):
    return json[DRAFT_GROUP_GAME_TYPE] == CLASSIC


def no_start_time_suffix(json):
    return json[DRAFT_GROUP_START_TIME_SUFFIX] is None


def is_flex(json):
    return json[DRAFTABLE_ROSTER_SLOT_ID] == FLEX_ROSTER_SLOT_ID


def is_dst(json):
    return json[DRAFTABLE_ROSTER_SLOT_ID] == DST_ROSTER_SLOT_ID


def to_game_entity(json):
    game = get_entity_by_type_and_id(json[COMPETITION_ID], Game)
    return (
        game
        if game
        else Game(
            id=json[COMPETITION_ID],
            away=json[COMPETITION_AWAY_TEAM][COMPETITION_TEAM_ID],
            home=json[COMPETITION_HOME_TEAM][COMPETITION_TEAM_ID],
            start=to_py_date_time(json[COMPETITION_START_TIME]),
        )
    )


def query_upcoming_draft_groups():
    return db.session.query(DraftGroup).filter(DraftGroup.start >= datetime.now() - timedelta(days=1)).all()


def get_entity_by_type_and_id(id, clazz):
    return db.session.query(clazz).filter_by(id=id).first()


def get_existing_player_entities_by_id_in(ids):
    return db.session.query(PlayerEntity).filter(PlayerEntity.dk_id.in_(ids)).all()


def to_draft_group_player(json, dg_id):
    return DraftGroupPlayer(
        id=json[DRAFTABLE_ID],
        salary=json[DRAFTABLE_SALARY],
        player_id=json[DRAFTABLE_PLAYER_ID]
        if json[DRAFTABLE_ROSTER_SLOT_ID] != 71
        else None,
        game_id=json[DRAFTABLE_COMPETITION][COMPETITION_ID],
        team_id=json[DRAFTABLE_TEAM_ID],
        roster_slot_id=json[DRAFTABLE_ROSTER_SLOT_ID],
        draft_group_id=dg_id,
        flex_id=json.get("flex_id", None),
    )


def persist_draft_group_data(dg):
    with db.session.no_autoflush:
        dg_id = dg[DRAFT_GROUP_ID]
        draft_group = requests.get(DRAFTGROUPS_URL.format(dg_id)).json()
        if draft_group[DRAFT_GROUP_DRAFTABLES]:
            db.session.add(
                DraftGroup(
                    id=dg_id,
                    site=Site.DRAFTKINGS,
                    start=to_py_date_time(dg[DRAFT_GROUP_START_DATE]),
                    suffix=dg[DRAFT_GROUP_START_TIME_SUFFIX],
                    type=SlateType.CLASSIC
                    if is_classic_game_type(dg)
                    else SlateType.SHOWDOWN,
                    games=[
                        to_game_entity(g) for g in draft_group[DRAFT_GROUP_COMPETITIONS]
                    ],
                )
            )

            players_json = draft_group[DRAFT_GROUP_DRAFTABLES]
            if is_classic_game_type(dg):
                flex = {}
                non_flex = {}
                for p in draft_group[DRAFT_GROUP_DRAFTABLES]:
                    if is_flex(p):
                        flex[p[DRAFTABLE_PLAYER_ID]] = {"flex_id": p[DRAFTABLE_ID]}
                    else:
                        non_flex[p[DRAFTABLE_PLAYER_ID]] = p
                players_json = [
                    {**player, **flex.get(p_id, {})}
                    for p_id, player in non_flex.items()
                ]

            draftable_player_ids = [
                p[DRAFTABLE_PLAYER_ID] for p in players_json if not is_dst(p)
            ]
            existing_player_entities = get_existing_player_entities_by_id_in(
                draftable_player_ids
            )
            existing_player_entity_ids = [p.dk_id for p in existing_player_entities]
            players_not_found = [
                pid
                for pid in draftable_player_ids
                if pid not in existing_player_entity_ids
            ]
            # if players_not_found:
            #     update_player_entities(
            #         [
            #             p
            #             for p in players_json
            #             if p[DRAFTABLE_PLAYER_ID] in players_not_found
            #         ]
            #     )

            db.session.add_all([to_draft_group_player(p, dg_id) for p in players_json])
            db.session.commit()


def extract_slates():
    # with app.app_context():
    #     [
    #         persist_draft_group_data(dg)
    #         for dg in [
    #             draftGroup
    #             for draftGroup in requests.get(NFL_CONTESTS_URL).json()[DRAFT_GROUPS]
    #             if is_classic_game_type(draftGroup) or is_showdown_game_type(draftGroup)
    #         ]
    #         if dg[DRAFT_GROUP_ID] not in [dg.id for dg in query_upcoming_draft_groups()]
    #     ]
    return query_upcoming_draft_groups()


def get_draft_group_data(draft_group_id):
    return get_entity_by_type_and_id(draft_group_id, DraftGroup).serialize(True)


def get_draft_groups():
    return [dg.serialize() for dg in extract_slates()]

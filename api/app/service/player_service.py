from app.model.models import *
from app.model.draftkings_api_constants import SLEEPER_API_URL
from app.service.db_service import to_player_entity
import requests


def draftable_to_player_entity(player_json):
    return PlayerEntity(
        first_name=player_json["firstName"],
        last_name=player_json["lastName"],
        full_name=player_json["displayName"],
        team=player_json["teamAbbreviation"],
        position=player_json["position"],
        dk_id=player_json["playerId"],
        swish_id=player_json["playerId"],
    )


def update_player_entities(draftable_players=[]):
    if draftable_players:
        player_entities = [draftable_to_player_entity(p) for p in draftable_players]
        all_players = requests.get(SLEEPER_API_URL).json().values()
        for p in player_entities:
            match = [
                player_sleeper
                for player_sleeper in all_players
                if player_sleeper.get('swish_id', None) == p.dk_id
            ]
            if match:
                p.status = match[0]["status"]
                p.hashtag = match[0]["hashtag"]
                p.stats_id = match[0]["stats_id"]
                p.yahoo_id = match[0]["yahoo_id"]
                p.rotowire_id = match[0]["rotowire_id"]
                p.espn_id = match[0]["espn_id"]
                p.gsis_id = match[0]["gsis_id"]
                p.rotoworld_id = match[0]["rotoworld_id"]
                p.fantasy_data_id = match[0]["fantasy_data_id"]
                p.sportradar_id = match[0]["sportradar_id"]
                p.sleeper_id = match[0]["player_id"]
            to_player_entity(p)
    else:
        [to_player_entity(p) for p in requests.get(SLEEPER_API_URL).json().values()]

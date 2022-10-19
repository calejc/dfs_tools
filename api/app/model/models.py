from datetime import datetime
import enum
from dataclasses import dataclass
from typing import List
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class SlateType(str, enum.Enum):
    SHOWDOWN = ("showdown",)
    CLASSIC = "classic"


class Site(str, enum.Enum):
    DRAFTKINGS = "dk"
    FANDUEL = "fd"


class ProjectionSource(str, enum.Enum):
    ONE_WEEK_SEASON = "ows"
    RUN_THE_SIMS = "rts"
    ESTABLISH_THE_RUN = "etr"
    OTHER = "other"


class PlayerPosition(str, enum.Enum):
    QB = "QB"
    RB = "RB"
    WR = "WR"
    TE = "TE"
    DEF = "DST"


@dataclass
class TeamEntity(db.Model):
    id: int
    name: str
    location: str
    short_location: str
    nickname: str
    slug: str

    team_color: str
    team_color2: str
    team_color3: str
    team_color4: str

    team_logo_wiki: str
    team_logo_espn: str
    team_wordmark: str

    nfl_id: int
    nfl_abbr: str
    dk_id: int
    dk_abbr: str
    pfr_abbr: str
    pff_id: int
    pff_abbr: str
    fo_abbr: str

    __tablename__ = "team"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    location = db.Column(db.String, nullable=False)
    short_location = db.Column(db.String, nullable=False)
    nickname = db.Column(db.String, nullable=False)
    slug = db.Column(db.String, nullable=False)

    team_color = db.Column(db.String, nullable=False)
    team_color2 = db.Column(db.String, nullable=False)
    team_color3 = db.Column(db.String, nullable=False)
    team_color4 = db.Column(db.String, nullable=False)

    team_logo_wiki = db.Column(db.String, nullable=False)
    team_logo_espn = db.Column(db.String, nullable=False)
    team_wordmark = db.Column(db.String, nullable=False)

    nfl_id = db.Column(db.Integer, nullable=False)
    nfl_abbr = db.Column(db.String, nullable=False)
    dk_id = db.Column(db.Integer, nullable=False)
    dk_abbr = db.Column(db.String, nullable=False)
    pfr_abbr = db.Column(db.String, nullable=False)
    pff_id = db.Column(db.Integer, nullable=False)
    pff_abbr = db.Column(db.String, nullable=False)
    fo_abbr = db.Column(db.String, nullable=False)


@dataclass
class PlayerEntity(db.Model):
    id: int
    first_name: str
    last_name: str
    full_name: str
    team: str
    position: str
    status: str
    hashtag: str

    stats_id: int
    dk_id: int
    swish_id: int
    yahoo_id: int
    rotowire_id: int
    espn_id: int
    gsis_id: str
    rotoworld_id: int
    fantasy_data_id: int
    sportradar_id: str
    sleeper_id: str

    __tablename__ = "player"
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    full_name = db.Column(db.String, nullable=False)
    team = db.Column(db.String, nullable=False)
    position = db.Column(db.String, nullable=False)
    status = db.Column(db.String, nullable=False)
    hashtag = db.Column(db.String, nullable=False)

    gsis_id = db.Column(db.String, nullable=True)
    sleeper_id = db.Column(db.String, nullable=False)
    sportradar_id = db.Column(db.String, nullable=True)
    stats_id = db.Column(db.Integer, nullable=True)
    dk_id = db.Column(db.Integer, nullable=True)
    swish_id = db.Column(db.Integer, nullable=True)
    yahoo_id = db.Column(db.Integer, nullable=True)
    rotowire_id = db.Column(db.Integer, nullable=True)
    rotoworld_id = db.Column(db.Integer, nullable=True)
    espn_id = db.Column(db.Integer, nullable=True)
    fantasy_data_id = db.Column(db.Integer, nullable=True)


@dataclass
class Game(db.Model):
    id: int
    draft_group_id: int
    start: datetime
    home_team: TeamEntity
    away_team: TeamEntity

    __tablename__ = "game"
    id = db.Column(db.Integer, primary_key=True)
    home = db.Column(db.Integer, db.ForeignKey("team.dk_id"))
    away = db.Column(db.Integer, db.ForeignKey("team.dk_id"))
    draft_group_id = db.Column(db.Integer, db.ForeignKey("draft_group.id"))
    start = db.Column(db.DateTime, nullable=False)
    home_team = db.relationship("TeamEntity", foreign_keys="Game.home")
    away_team = db.relationship("TeamEntity", foreign_keys="Game.away")


@dataclass
class DraftGroupPlayer(db.Model):
    id: int
    salary: int
    roster_slot_id: int
    team_id: int
    game_id: int
    player: PlayerEntity

    __tablename__ = "draft_group_player"
    id = db.Column(db.Integer, primary_key=True)
    salary = db.Column(db.Integer, nullable=False)
    roster_slot_id = db.Column(db.Integer, nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey("player.dk_id"))
    team_id = db.Column(db.Integer, db.ForeignKey("team.dk_id"))
    game_id = db.Column(db.Integer, db.ForeignKey("game.id"))
    draft_group_id = db.Column(db.Integer, db.ForeignKey("draft_group.id"))
    player = db.relationship("PlayerEntity")


@dataclass
class DraftGroup(db.Model):
    id: int
    site: str
    type: str
    start: datetime
    games: List[Game]
    players: List[DraftGroupPlayer]

    __tablename__ = "draft_group"
    id = db.Column(db.Integer, primary_key=True)
    site = db.Column(db.Enum(Site), nullable=False)
    type = db.Column(db.Enum(SlateType), nullable=False)
    start = db.Column(db.DateTime, nullable=False)
    games = db.relationship("Game")
    players = db.relationship("DraftGroupPlayer")

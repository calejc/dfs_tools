from datetime import datetime
import enum
from dataclasses import dataclass
from typing import List, Union
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


class Projection(db.Model):
    __tablename__ = "projection"
    id: int = db.Column(db.Integer, primary_key=True)
    draft_group_player_id = db.Column(
        db.Integer, db.ForeignKey("draft_group_player.id")
    )

    source: str = db.Column(db.Enum(ProjectionSource), nullable=False)
    base: float = db.Column(db.Float)
    median: float = db.Column(db.Float)
    ceiling: float = db.Column(db.Float)

    value: float = db.Column(db.Float)
    etr_value: float = db.Column(db.Float)

    boom: float = db.Column(db.Float)
    optimal: float = db.Column(db.Float)
    ownership: float = db.Column(db.Float)


@dataclass
class TeamEntity(db.Model):
    __tablename__ = "team"
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String, nullable=False)
    location: str = db.Column(db.String, nullable=False)
    short_location: str = db.Column(db.String, nullable=False)
    nickname: str = db.Column(db.String, nullable=False)
    slug: str = db.Column(db.String, nullable=False)

    team_color: str = db.Column(db.String, nullable=False)
    team_color2: str = db.Column(db.String, nullable=False)
    team_color3: str = db.Column(db.String, nullable=False)
    team_color4: str = db.Column(db.String, nullable=False)

    team_logo_wiki: str = db.Column(db.String, nullable=False)
    team_logo_espn: str = db.Column(db.String, nullable=False)
    team_wordmark: str = db.Column(db.String, nullable=False)

    nfl_id: int = db.Column(db.Integer, nullable=False)
    nfl_abbr: str = db.Column(db.String, nullable=False)
    dk_id: int = db.Column(db.Integer, nullable=False)
    dk_abbr: str = db.Column(db.String, nullable=False)
    pfr_abbr: str = db.Column(db.String, nullable=False)
    pff_id: int = db.Column(db.Integer, nullable=False)
    pff_abbr: str = db.Column(db.String, nullable=False)
    fo_abbr: int = db.Column(db.String, nullable=False)


@dataclass
class PlayerEntity(db.Model):
    __tablename__ = "player"
    id: int = db.Column(db.Integer, primary_key=True)
    first_name: str = db.Column(db.String, nullable=False)
    last_name: str = db.Column(db.String, nullable=False)
    full_name: str = db.Column(db.String, nullable=False)
    team: str = db.Column(db.String, nullable=False)
    position: str = db.Column(db.String, nullable=False)
    status: str = db.Column(db.String, nullable=False)
    hashtag: str = db.Column(db.String, nullable=False)

    gsis_id: int = db.Column(db.String, nullable=True)
    sleeper_id: str = db.Column(db.String, nullable=False)
    sportradar_id: str = db.Column(db.String, nullable=True)
    stats_id: int = db.Column(db.Integer, nullable=True)
    dk_id: int = db.Column(db.Integer, nullable=True)
    swish_id: int = db.Column(db.Integer, nullable=True)
    yahoo_id: int = db.Column(db.Integer, nullable=True)
    rotowire_id: int = db.Column(db.Integer, nullable=True)
    rotoworld_id: int = db.Column(db.Integer, nullable=True)
    espn_id: int = db.Column(db.Integer, nullable=True)
    fantasy_data_id: int = db.Column(db.Integer, nullable=True)


@dataclass
class Game(db.Model):
    __tablename__ = "game"
    id: int = db.Column(db.Integer, primary_key=True)
    home = db.Column(db.Integer, db.ForeignKey("team.dk_id"))
    away = db.Column(db.Integer, db.ForeignKey("team.dk_id"))
    draft_group_id: int = db.Column(db.Integer, db.ForeignKey("draft_group.id"))
    start: datetime = db.Column(db.DateTime, nullable=False)
    home_team: TeamEntity = db.relationship("TeamEntity", foreign_keys="Game.home")
    away_team: TeamEntity = db.relationship("TeamEntity", foreign_keys="Game.away")


@dataclass
class DraftGroupPlayer(db.Model):
    __tablename__ = "draft_group_player"
    player: Union[PlayerEntity, TeamEntity]
    id: int = db.Column(db.Integer, primary_key=True)
    salary: int = db.Column(db.Integer, nullable=False)
    roster_slot_id: int = db.Column(db.Integer, nullable=False)
    game_id: int = db.Column(db.Integer, db.ForeignKey("game.id"))
    player_id = db.Column(db.Integer, db.ForeignKey("player.dk_id"))
    team_id = db.Column(db.Integer, db.ForeignKey("team.dk_id"))
    draft_group_id = db.Column(db.Integer, db.ForeignKey("draft_group.id"))
    _player = db.relationship("PlayerEntity")
    _team = db.relationship("TeamEntity")
    projections: List[Projection] = db.relationship('Projection')

    @property
    def player(self):
        return self._player if self.player_id else self._team


@dataclass
class DraftGroup(db.Model):
    __tablename__ = "draft_group"
    id: int = db.Column(db.Integer, primary_key=True)
    site: str = db.Column(db.Enum(Site), nullable=False)
    type: str = db.Column(db.Enum(SlateType), nullable=False)
    start: datetime = db.Column(db.DateTime, nullable=False)
    games: List[Game] = db.relationship("Game")
    players: List[DraftGroupPlayer] = db.relationship("DraftGroupPlayer")

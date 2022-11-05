from datetime import datetime
import enum
from dataclasses import dataclass, field
from typing import List, Union
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect

db = SQLAlchemy()


class SlateType(str, enum.Enum):
    SHOWDOWN = "showdown"
    CLASSIC = "classic"


class Site(str, enum.Enum):
    DRAFTKINGS = "dk"
    FANDUEL = "fd"


class ProjectionSource(str, enum.Enum):
    ONE_WEEK_SEASON = "ows"
    RUN_THE_SIMS = "rts"
    ESTABLISH_THE_RUN = "etr"
    DAILY_ROTO = "dr"
    OTHER = "other"


def avg_column_property(id, col, round):
    return db.column_property(
        db.select(
            db.func.round(
                db.func.avg(col).label("{}".format(str(col).split(".")[1])), round
            )
        )
        .where(
            db.and_(
                draft_group_player_projection_relational_table.c.draft_group_player_id
                == id,
                draft_group_player_projection_relational_table.c.projection_id
                == Projection.id,
            )
        )
        .scalar_subquery()
    )


draft_group_player_projection_relational_table = db.Table(
    "draft_group_player_projection",
    db.Column("draft_group_player_id", db.ForeignKey("draft_group_player.id")),
    db.Column("projection_id", db.ForeignKey("projection.id")),
    db.UniqueConstraint("draft_group_player_id", "projection_id"),
)


draft_group_game_relational_table = db.Table(
    "draft_group_game",
    db.Column("draft_group_id", db.ForeignKey("draft_group.id")),
    db.Column("game_id", db.ForeignKey("game.id")),
    db.UniqueConstraint("draft_group_id", "game_id"),
)


@dataclass
class Projection(db.Model):
    __tablename__ = "projection"
    id: int = db.Column(db.Integer, primary_key=True)

    source: str = db.Column(db.Enum(ProjectionSource), nullable=False)
    base: float = db.Column(db.Float)
    median: float = db.Column(db.Float)
    ceiling: float = db.Column(db.Float)
    value: float = db.Column(db.Float)

    boom: float = db.Column(db.Float)
    optimal: float = db.Column(db.Float)
    ownership: float = db.Column(db.Float)

    # RTS Showdown-specific
    cpt_rate: float = db.Column(db.Float)
    flex_rate: float = db.Column(db.Float)


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
    start: datetime = db.Column(db.DateTime, nullable=False)
    home_team: TeamEntity = db.relationship("TeamEntity", foreign_keys="Game.home")
    away_team: TeamEntity = db.relationship("TeamEntity", foreign_keys="Game.away")


@dataclass
class DraftGroupPlayer(db.Model):
    __tablename__ = "draft_group_player"
    ceiling: float
    base: float
    median: float
    value: float
    ownership: float
    boom: float
    optimal: float
    cpt_rate: float
    flex_rate: float
    player: Union[PlayerEntity, TeamEntity]
    id: int = db.Column(db.Integer, primary_key=True)
    salary: int = db.Column(db.Integer, nullable=False)
    roster_slot_id: int = db.Column(db.Integer, nullable=False)
    flex_id: int = db.Column(db.Integer)
    game_id: int = db.Column(db.Integer, db.ForeignKey("game.id"))
    player_id = db.Column(db.Integer, db.ForeignKey("player.dk_id"))
    team_id = db.Column(db.Integer, db.ForeignKey("team.dk_id"))
    draft_group_id = db.Column(db.Integer, db.ForeignKey("draft_group.id"))
    _player = db.relationship("PlayerEntity")
    _team = db.relationship("TeamEntity")
    projections = db.relationship(
        "Projection", secondary=draft_group_player_projection_relational_table
    )

    @property
    def player(self):
        return self._player if self.player_id else self._team

    base = avg_column_property(id, Projection.base, 2)
    ceiling = avg_column_property(id, Projection.ceiling, 2)
    median = avg_column_property(id, Projection.median, 2)
    value = avg_column_property(id, Projection.value, 2)
    ownership = avg_column_property(id, Projection.ownership, 3)
    boom = avg_column_property(id, Projection.boom, 3)
    optimal = avg_column_property(id, Projection.optimal, 3)
    cpt_rate = avg_column_property(id, Projection.cpt_rate, 2)
    flex_rate = avg_column_property(id, Projection.flex_rate, 2)

    # opp = db.column_property(
    #     db.select()
    # )


@dataclass(repr=False)
class DraftGroup(db.Model):
    __tablename__ = "draft_group"
    id: int = db.Column(db.Integer, primary_key=True)
    site: str = db.Column(db.Enum(Site), nullable=False)
    type: str = db.Column(db.Enum(SlateType), nullable=False)
    start: datetime = db.Column(db.DateTime, nullable=False)
    suffix: str = db.Column(db.String)
    players: List[DraftGroupPlayer] = db.relationship("DraftGroupPlayer")
    games: List[Game] = db.relationship(
        "Game", secondary=draft_group_game_relational_table
    )

    def serialize(self, eager_fetch=False):
        return {
            "id": self.id,
            "site": self.site,
            "type": self.type,
            "start": self.start.isoformat(),
            "suffix": self.suffix,
            "games": self.games if eager_fetch else len(self.games),
            "players": self.players if eager_fetch else [],
        }

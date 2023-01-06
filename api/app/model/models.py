from datetime import datetime
import enum
from dataclasses import dataclass
from typing import List
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class SlateType(str, enum.Enum):
    SHOWDOWN = "showdown"
    CLASSIC = "classic"


class Site(str, enum.Enum):
    DRAFTKINGS = "dk"
    FANDUEL = "fd"


class ProjectionSource(str, enum.Enum):
    RUN_THE_SIMS = "rts"
    ESTABLISH_THE_RUN = "etr"
    OTHER = "other"


def avg_column_property(draftable_id, col, round, single_source=None):
    filters = [
        draft_group_player_projection_relational_table.c.draft_group_player_id
        == draftable_id,
        draft_group_player_projection_relational_table.c.projection_id == Projection.id,
    ]
    filters.append(Projection.source == single_source) if single_source else None
    return db.column_property(
        db.select(
            db.func.round(
                db.func.avg(col).label("{}".format(str(col).split(".")[1])), round
            )
        )
        .where(db.and_(*filters))
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
    # cpt_rate: float = db.Column(db.Float)
    # flex_rate: float = db.Column(db.Float)


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

    def serialize(self):
        return {
            "abbr": self.dk_abbr,
            "logo": "/img/{}.png".format(self.dk_abbr.lower()),
            "color": self.team_color,
        }


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
    player: str
    team: str
    opp: str
    max: int
    min: int
    projected: float
    id: int = db.Column(db.Integer, primary_key=True)
    salary: int = db.Column(db.Integer, nullable=False)
    roster_slot_id: int = db.Column(db.Integer, nullable=False)
    flex_id: int = db.Column(db.Integer)
    game_id: int = db.Column(db.Integer, db.ForeignKey("game.id"))
    player_id: int = db.Column(db.Integer, db.ForeignKey("player.dk_id"))
    team_id = db.Column(db.Integer, db.ForeignKey("team.dk_id"))
    draft_group_id = db.Column(db.Integer, db.ForeignKey("draft_group.id"))
    _player = db.relationship("PlayerEntity")
    _team = db.relationship("TeamEntity")
    _game = db.relationship("Game")
    projections = db.relationship(
        "Projection", secondary=draft_group_player_projection_relational_table
    )
    base: float = avg_column_property(id, Projection.base, 2)
    ceiling: float = avg_column_property(id, Projection.ceiling, 2)
    median: float = avg_column_property(id, Projection.median, 2)
    value: float = avg_column_property(id, Projection.value, 2)
    ownership: float = avg_column_property(
        id, Projection.ownership, 3, ProjectionSource.ESTABLISH_THE_RUN
    )
    boom: float = avg_column_property(id, Projection.boom, 3)
    optimal: float = avg_column_property(id, Projection.optimal, 3)

    @property
    def player(self):
        return (
            self._player.full_name
            if self.player_id and self._player
            else self._team.nickname
        )

    @property
    def team(self):
        return self._team.serialize()

    @property
    def max(self):
        return 100

    @property
    def min(self):
        return 0

    @property
    def projected(self):
        return self.ceiling

    @property
    def game_time(self):
        return self._game.start

    @property
    def opp(self):
        return [
            team.serialize()
            for team in [self._game.home_team, self._game.away_team]
            if team.dk_id != self.team_id
        ][0]


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


##############################
#  API Models for Optimizer  #
##############################
class OptimizerStackOption:
    def __init__(self, rb: int, wr: int, te: int, flex: int, wrte: int):
        self.rb = rb
        self.wr = wr
        self.te = te
        self.flex = flex
        self.wrte = wrte

    def stacking(self):
        return any(c != 0 for c in [self.rb, self.wr, self.te, self.flex, self.wrte])

    def stacked_positions(self):
        return {k: v for k, v in vars(self).items() if v != 0}


class OptimizerStackOptions:
    def __init__(self, with_qb: OptimizerStackOption, opp: OptimizerStackOption):
        self.with_qb = with_qb
        self.opp = opp


class OptimizerConstraintsModel:
    def __init__(
        self,
        draft_group_id: int,
        count: int,
        unique: int,
        max_per_team: int,
        flex: list,
        stack: OptimizerStackOptions,
        use_ceiling: bool,
        players: List[DraftGroupPlayer],
    ):
        self.draft_group_id = draft_group_id
        self.count = count
        self.unique = unique
        self.max_per_team = max_per_team
        self.flex = flex
        self.stack = stack
        self.use_ceiling = use_ceiling,
        self.players = players

    @property
    def min_rb(self):
        return 2

    @property
    def max_rb(self):
        return 3 if self.flex["RB"] is True else 2

    @property
    def min_wr(self):
        return 3

    @property
    def max_wr(self):
        return 4 if self.flex["WR"] is True else 3

    @property
    def min_te(self):
        return 1

    @property
    def max_te(self):
        return 2 if self.flex["TE"] is True else 1

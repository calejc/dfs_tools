import enum
from dataclasses import dataclass
from flask_sqlalchemy import SQLAlchemy
from dataclasses import dataclass

db = SQLAlchemy()


class Site(enum.Enum):
    DRAFTKINGS = "dk"
    FANDUEL = "fd"


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
class Slate(db.Model):
    id: int
    id = db.Column(db.Integer, primary_key=True)


@dataclass
class SlatePlayerDetails(db.Model):
    """
    Player for a given DFS slate, with matchup, salary, and projection data.
    """

    id: int
    salary: int
    opp: str
    site: str

    rts_median_projection: float
    ows_median_projection: float
    etr_median_projection: float
    aggr_median_projection: float

    rts_ceiling_projection: float
    ows_ceiling_projection: float
    etr_ceiling_projection: float
    aggr_ceiling_projection: float

    __tablename__ = "slate_player"
    id = db.Column(db.Integer, primary_key=True)
    salary = db.Column(db.Integer, nullable=False)
    opp = db.Column(db.String, nullable=False)
    site = db.Column(db.String, nullable=False)

    rts_median_projection = db.Column(db.Float, nullable=False)
    ows_median_projection = db.Column(db.Float, nullable=False)
    etr_median_projection = db.Column(db.Float, nullable=False)
    aggr_median_projection = db.Column(db.Float, nullable=False)

    rts_ceiling_projection = db.Column(db.Float, nullable=False)
    ows_ceiling_projection = db.Column(db.Float, nullable=False)
    etr_ceiling_projection = db.Column(db.Float, nullable=False)
    aggr_ceiling_projection = db.Column(db.Float, nullable=False)


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
    swish_id = db.Column(db.Integer, nullable=True)
    yahoo_id = db.Column(db.Integer, nullable=True)
    rotowire_id = db.Column(db.Integer, nullable=True)
    rotoworld_id = db.Column(db.Integer, nullable=True)
    espn_id = db.Column(db.Integer, nullable=True)
    fantasy_data_id = db.Column(db.Integer, nullable=True)

from app.model.models import *
from app.model.draftkings_api_constants import DST_ROSTER_SLOT_ID


class Columns:
    def __init__(
        self,
        draft_group_player_id,
        player,
        position,
        team,
        base,
        median,
        ceiling,
        value,
        boom,
        optimal,
        ownership,
        cpt_rate,
        flex_rate,
    ):
        self.draft_group_player_id = draft_group_player_id
        self.player = player
        self.position = position
        self.team = team
        self.base = base
        self.median = median
        self.ceiling = ceiling
        self.value = value
        self.boom = boom
        self.optimal = optimal
        self.ownership = ownership
        self.cpt_rate = cpt_rate
        self.flex_rate = flex_rate
        self.name_suffixes = [" Jr", " Jr.", " Sr", " Sr.", " III", " II"]

    def get_base(self, row):
        return row.get(self.base, None)

    def get_ownership(self, row):
        return row.get(self.ownership, None)

    def get_position(self, row):
        return row.get(self.position, None)

    def get_ceiling(self, row):
        return row.get(self.ceiling, None)

    def get_optimal(self, row):
        return row.get(self.optimal, None)

    def get_player(self, row):
        return row.get(self.player, None)

    def format_rate_value(self, value):
        if "%" in value:
            return float(value.split("%")[0])
        else:
            return float(value) * 100

    def get_rate_value(self, row, key):
        return self.format_rate_value(row.get(key, None))

    def name_without_suffix(self, name):
        stripped = name
        for s in self.name_suffixes:
            if name.endswith(s):
                stripped = name.replace(s, "")
                return stripped
        return stripped

    def get_populated_value(self, columns):
        return next(
            (projection for projection in columns if projection is not None), None
        )

    def extract_csv_value(self, row, key):
        try:
            if key == self.base:
                return self.get_base(row)
            elif key == self.ownership:
                return self.get_ownership(row)
            elif key == self.player:
                return self.get_player(row)
            elif key == self.position:
                return self.get_position(row)
            elif key == self.optimal:
                return self.get_optimal(row)
            elif key in [self.boom, self.cpt_rate, self.flex_rate]:
                return self.get_rate_value(row, key)
            else:
                return row.get(key, None)
        except:
            return None

    def get_player_id_subquery(self, row, db_session):
        player_name = self.name_without_suffix(self.get_player(row))
        position = self.get_position(row)
        return db_session.query(PlayerEntity.dk_id).filter(
            PlayerEntity.full_name == player_name,
            PlayerEntity.position == position,
        )

    def get_team_id_subquery(self, row, db_session):
        return db_session.query(TeamEntity.dk_id).filter(
            TeamEntity.dk_abbr == row.get(self.team, None)
        )

    def get_draft_group_players(self, row, draft_group_id, db_session):
        filters = [DraftGroupPlayer.draft_group_id == draft_group_id]
        if self.draft_group_player_id and row.get(self.draft_group_player_id, None):
            filters.append(
                DraftGroupPlayer.id == row.get(self.draft_group_player_id, None)
            )
            return db_session.query(DraftGroupPlayer).filter(*filters).first()

        if self.get_position(row) == "DST":
            filters += [
                DraftGroupPlayer.roster_slot_id == DST_ROSTER_SLOT_ID,
                DraftGroupPlayer.team_id == self.get_team_id_subquery(row, db_session),
            ]
        else:
            filters.append(
                DraftGroupPlayer.player_id
                == self.get_player_id_subquery(row, db_session)
            )

        return db_session.query(DraftGroupPlayer).filter(*filters).first()


class EstablishTheRunColumns(Columns):
    def __init__(self):
        super().__init__(
            "DKSlateID",
            "Player",
            "DK Position",
            "Team",
            "DK Projection",
            None,
            "DK Ceiling",
            "DK Value",
            None,
            None,
            "DK Ownership",
            None,
            None,
        )

    def get_position(self, row):
        return self.get_populated_value(
            [row.get(self.position, None), row.get("Position", None)]
        )

    def get_base(self, row):
        return self.get_populated_value(
            [row.get(self.base, None), row.get("DK", None), row.get("Projection", None)]
        )

    def get_ceiling(self, row):
        return self.get_populated_value(
            [row.get(self.base, None), row.get("DK", None), row.get("Ceiling", None)]
        )


class RunTheSimsColumns(Columns):
    def __init__(self):
        super().__init__(
            "Slate ID",
            "Player",
            "Position",
            "Team",
            "Base Projection",
            "Projection 50%",
            "p080",
            "Pts/$",
            "Boom Rate",
            "Optimal Rates",
            "Proj Own",
            "CPT Rate",
            "FLEX Rate",
        )

    def get_ownership(self, row):
        return self.format_rate_value(
            self.get_populated_value(
                [
                    row.get(self.ownership, None),
                    row.get("projOwn", None),
                ],
            )
        )

    def get_base(self, row):
        return self.get_populated_value(
            [
                row.get(self.base, None),
                row.get("projected points", None),
                row.get("p050", None),
            ],
        )

    def get_optimal(self, row):
        return self.format_rate_value(
            self.get_populated_value(
                [
                    row.get(self.optimal, None),
                    row.get("Optimal Rate", None),
                ],
            )
        )


# TODO: map
class DailyRotoColumns(Columns):
    def __init__(self):
        super().__init__(
            "DK Projection",
            None,
            "DK Ceiling",
            None,
            None,
            None,
            "DK Ownership",
        )


# TODO: map
class OneWeekSeasonColumns(Columns):
    def __init__(self):
        super().__init__(
            "DK Projection",
            None,
            "DK Ceiling",
            None,
            None,
            None,
            "DK Ownership",
        )


# TODO: design generic mapping/template
class GenericColumns(Columns):
    def __init__(self):
        super().__init__(
            "ID",
            "Player",
            "Position",
            "Team",
            "Base",
            "Median",
            "Ceiling",
            "Value",
            "Boom Rate",
            "Optimal Rate",
            "pOwn",
            "CPT Rate",
            "FLEX Rate",
        )

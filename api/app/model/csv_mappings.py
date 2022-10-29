from app.model.models import *


class Columns:
    def __init__(
        self,
        draft_group_player_id,
        player,
        position,
        base,
        median,
        ceiling,
        value,
        etr_value,
        boom,
        optimal,
        ownership,
        cpt_rate,
        flex_rate,
    ):
        self.draft_group_player_id = draft_group_player_id
        self.player = player
        self.position = position
        self.base = base
        self.median = median
        self.ceiling = ceiling
        self.value = value
        self.etr_value = etr_value
        self.boom = boom
        self.optimal = optimal
        self.ownership = ownership
        self.cpt_rate = cpt_rate
        self.flex_rate = flex_rate

    def get_base(self, row):
        return row.get(self.base, None)

    def get_ownership(self, row):
        return row.get(self.ownership, None)

    def get_ceiling(self, row):
        return row.get(self.ceiling, None)

    def get_player(self, row):
        return row.get(self.player, None)

    def get_position(self, row):
        return row.get(self.position, None)

    def get_rate_value(self, row, key):
        value = row.get(key, None)
        if "%" in value:
            return float(value.split("%")[0])
        else:
            return float(value) * 100

    def extract_value(self, row, key):
        try:
            if key == self.base:
                return self.get_base(row)
            elif key == self.ownership:
                return self.get_ownership(row)
            elif key == self.ceiling:
                return self.get_ceiling(row)
            elif key == self.player:
                return self.get_player(row)
            elif key == self.position:
                return self.get_position(row)
            elif key in [self.boom, self.optimal, self.cpt_rate, self.flex_rate]:
                return self.get_rate_value(row, key)
            else:
                return row.get(key, None)
        except:
            return None

    def get_player_id_subquery(self, row, db_session):
        if self.draft_group_player_id and row.get(self.draft_group_player_id, None):
            return db_session.query(DraftGroupPlayer.player_id).filter(
                DraftGroupPlayer.id == row[self.draft_group_player_id]
            )
        else:
            player_name = self.get_player(row)
            position = self.get_position(row)
            return db_session.query(PlayerEntity.dk_id).filter(
                PlayerEntity.full_name == player_name,
                PlayerEntity.position == position,
            )

    def get_team_id_subquery():
        pass

    def get_draft_group_players(self, row, draft_group_id, db_session):
        if row.get(self.position, None) == "DST":
            return (
                db_session.query(DraftGroupPlayer).filter(
                    DraftGroupPlayer.id == row.get(self.draft_group_player_id, None)
                )
                if self.draft_group_player_id
                and row.get(self.draft_group_player_id, None)
                else db_session.query(DraftGroupPlayer)
                .filter(
                    DraftGroupPlayer.draft_group_id == draft_group_id,
                    DraftGroupPlayer.roster_slot_id == 71,
                    DraftGroupPlayer.player_id
                    == self.get_team_id_subquery(row, db_session),
                )
                .first()
            )
        else:
            return (
                db_session.query(DraftGroupPlayer)
                .filter(
                    DraftGroupPlayer.draft_group_id == draft_group_id,
                    DraftGroupPlayer.player_id
                    == self.get_player_id_subquery(row, db_session),
                )
                .all()
            )


class EstablishTheRunColumns(Columns):
    def __init__(self):
        super().__init__(
            "DKSlateID",
            "Player",
            "DK Position",
            "DK Projection",
            None,
            "DK Ceiling",
            None,
            "DK Value",
            None,
            None,
            "DK Ownership",
            None,
            None,
        )


class RunTheSimsColumns(Columns):
    def __init__(self):
        super().__init__(
            "Slate ID",
            "Player",
            "Position",
            "Base Projection",
            "Projection 50%",
            "Projection Ceil",
            "Pts/$",
            None,
            "Boom Rate",
            "Optimal Rates",
            "Proj Own",
            "CPT Rate",
            "FLEX Rate",
        )

    def get_ownership(self, row):
        ownership = self.get_populated_value(
            [
                row.get(self.ownership, None),
                row.get("projOwn", None),
            ],
        )
        if "%" in ownership:
            return float(ownership.split("%")[0])
        else:
            return float(ownership) * 100

    def get_base(self, row):
        return self.get_populated_value(
            [
                row.get(self.base, None),
                row.get("projected points", None),
                row.get("p050", None),
            ],
        )

    def get_ceiling(self, row):
        return self.get_populated_value(
            [
                row.get(self.ceiling, None),
                row.get("p090", None),
            ],
        )

    def get_player(self, row):
        return self.get_populated_value(
            [row.get(self.player, None), row.get("player", None)]
        )

    def get_position(self, row):
        return self.get_populated_value(
            [
                row.get(self.position, None),
                row.get("position", None),
            ],
        )

    def get_populated_value(self, columns):
        return next(
            (projection for projection in columns if projection is not None), None
        )


# TODO: map
class DailyRotoColumns(Columns):
    def __init__(self):
        super().__init__(
            "DK Projection",
            None,
            "DK Ceiling",
            None,
            "DK Value",
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
            "DK Value",
            None,
            None,
            "DK Ownership",
        )


# TODO: design generic mapping/template
class GenericColumns(Columns):
    def __init__(self):
        super().__init__(
            "DK Projection",
            None,
            "DK Ceiling",
            None,
            "DK Value",
            None,
            None,
            "DK Ownership",
        )

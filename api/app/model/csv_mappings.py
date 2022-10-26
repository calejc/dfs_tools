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

    def get_ownership(self, row):
        return row.get(self.ownership, None)

    def get_player_id_subquery(self, row, db_session):
        if self.draft_group_player_id and row.get(self.draft_group_player_id, None):
            return db_session.query(DraftGroupPlayer.player_id).filter(
                DraftGroupPlayer.id == row[self.draft_group_player_id]
            )
        else:
            return db_session.query(PlayerEntity.player_id).filter(
                PlayerEntity.full_name == row[self.player],
                PlayerEntity.position == row[self.position],
            )

    def get_draft_group_players(self, row, draft_group_id, db_session):
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
        )


class RunTheSimsColumns(Columns):
    def __init__(self):
        super().__init__(
            "Slate ID",
            "Player:",
            "Position",
            "Base Projection",
            "Projection 50%",
            "Projection Ceil",
            "Pts/$",
            None,
            "Boom Rate",
            "Optimal Rates",
            None,
        )

    def get_ownership(self, row):
        ownership = row["Proj Own"] if row.has_key("Proj Own") else row["projOwn"]
        if "%" in ownership:
            return int(ownership.split("%")[0]) / 100
        else:
            return int(ownership)


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

from pulp import LpMaximize, LpProblem, lpSum, LpVariable
from app.model.models import *
from app.model.draftkings_api_constants import (
    QB_ROSTER_SLOT_ID,
    RB_ROSTER_SLOT_ID,
    WR_ROSTER_SLOT_ID,
    TE_ROSTER_SLOT_ID,
    DST_ROSTER_SLOT_ID,
)


def query_player(player_var):
    return (
        db.session.query(DraftGroupPlayer)
        .filter(DraftGroupPlayer.id == player_var.name.split("_")[1])
        .first()
    )


def determine_flex_player(lineup):
    rbs = []
    wrs = []
    tes = []
    for p in lineup:
        if p.roster_slot_id == RB_ROSTER_SLOT_ID:
            rbs.append(p)
        elif p.roster_slot_id == WR_ROSTER_SLOT_ID:
            wrs.append(p)
        elif p.roster_slot_id == TE_ROSTER_SLOT_ID:
            tes.append(p)

    flex = None
    if len(rbs) == 3:
        flex = RB_ROSTER_SLOT_ID
    elif len(wrs) == 4:
        flex = WR_ROSTER_SLOT_ID
    elif len(tes) == 2:
        flex = TE_ROSTER_SLOT_ID
    return max(
        [p for p in lineup if p.roster_slot_id == flex],
        key=lambda x: x.game_time,
    )


def to_lineup(model):
    lineup = [query_player(p) for p in model.variables() if p.varValue > 0]
    flex_player = determine_flex_player(lineup)

    # TODO: disgusting, find a better way to get players in the correct lineup order
    sorted_lineup = []
    sorted_lineup += [p for p in lineup if p.roster_slot_id == QB_ROSTER_SLOT_ID]
    sorted_lineup += [
        p for p in lineup if p.roster_slot_id == RB_ROSTER_SLOT_ID and p != flex_player
    ]
    sorted_lineup += [
        p for p in lineup if p.roster_slot_id == WR_ROSTER_SLOT_ID and p != flex_player
    ]
    sorted_lineup += [
        p for p in lineup if p.roster_slot_id == TE_ROSTER_SLOT_ID and p != flex_player
    ]
    sorted_lineup += [flex_player]
    sorted_lineup += [p for p in lineup if p.roster_slot_id == DST_ROSTER_SLOT_ID]

    return sorted_lineup


def pos_to_roster_slots(pos):
    if pos == "rb":
        return [RB_ROSTER_SLOT_ID]
    elif pos == "wr":
        return [WR_ROSTER_SLOT_ID]
    elif pos == "te":
        return [TE_ROSTER_SLOT_ID]
    elif pos == "flex":
        return [RB_ROSTER_SLOT_ID, WR_ROSTER_SLOT_ID, TE_ROSTER_SLOT_ID]
    elif pos == "wrte":
        return [WR_ROSTER_SLOT_ID, TE_ROSTER_SLOT_ID]


def optimize(constraints: OptimizerConstraintsModel):
    SALARY_CAP = 50000
    players = {
        p.id: {
            "sal": p.salary,
            "pts": p.ceiling,
            "pos": p.roster_slot_id,
            "team": p.team,
            "opp": p.opp,
        }
        for p in db.session.query(DraftGroupPlayer)
        .filter(DraftGroupPlayer.draft_group_id == constraints.draft_group_id)
        .all()
        if p.ceiling is not None
    }
    player_vars = LpVariable.dicts("player", players.keys(), cat="Binary")
    model = LpProblem(name="optimize", sense=LpMaximize)

    if constraints.stack.with_qb.stacking() or constraints.stack.opp.stacking():
        for qb in [p for p in players if players[p]["pos"] == QB_ROSTER_SLOT_ID]:
            for pos, count in constraints.stack.with_qb.stacked_positions().items():
                c = count * -1
                model += (
                    lpSum(
                        [
                            player_vars[i]
                            for i, data in players.items()
                            if data["team"] == players[qb]["team"]
                            and data["pos"] in pos_to_roster_slots(pos)
                        ]
                        + [c * player_vars[qb]]
                    )
                    >= 0
                )
            for pos, count in constraints.stack.opp.stacked_positions().items():
                c = count * -1
                model += (
                    lpSum(
                        [
                            player_vars[i]
                            for i, data in players.items()
                            if data["team"] == players[qb]["opp"]
                            and data["pos"] in pos_to_roster_slots(pos)
                        ]
                        + [c * player_vars[qb]]
                    )
                    >= 0
                )

    model += lpSum([players[p]["pts"] * player_vars[p] for p in players.keys()])
    model += (
        lpSum([players[p]["sal"] * player_vars[p] for p in players.keys()])
        <= SALARY_CAP
    )

    # RB
    model += (
        lpSum(
            [
                player_vars[p]
                for p, player_data in players.items()
                if player_data["pos"] == RB_ROSTER_SLOT_ID
            ]
        )
        >= constraints.min_rb
    )
    model += (
        lpSum(
            [
                player_vars[p]
                for p, player_data in players.items()
                if player_data["pos"] == RB_ROSTER_SLOT_ID
            ]
        )
        <= constraints.max_rb
    )

    # WR
    model += (
        lpSum(
            [
                player_vars[p]
                for p, player_data in players.items()
                if player_data["pos"] == WR_ROSTER_SLOT_ID
            ]
        )
        >= constraints.min_wr
    )
    model += (
        lpSum(
            [
                player_vars[p]
                for p, player_data in players.items()
                if player_data["pos"] == WR_ROSTER_SLOT_ID
            ]
        )
        <= constraints.max_wr
    )

    # TE
    model += (
        lpSum(
            [
                player_vars[p]
                for p, player_data in players.items()
                if player_data["pos"] == TE_ROSTER_SLOT_ID
            ]
        )
        == constraints.min_te
    )
    model += (
        lpSum(
            [
                player_vars[p]
                for p, player_data in players.items()
                if player_data["pos"] == TE_ROSTER_SLOT_ID
            ]
        )
        <= constraints.max_te
    )

    # QB
    model += (
        lpSum(
            [
                player_vars[p]
                for p, player_data in players.items()
                if player_data["pos"] == QB_ROSTER_SLOT_ID
            ]
        )
        == 1
    )

    # DST
    model += (
        lpSum(
            [
                player_vars[p]
                for p, player_data in players.items()
                if player_data["pos"] == DST_ROSTER_SLOT_ID
            ]
        )
        == 1
    )

    model += lpSum([player_vars[p] for p in players.keys()]) == 9

    # No two or more RB/WR/TE from same team.
    # for rbwrte in [p for p in players if players[p]["pos"] in (67, 68, 69)]:
    #     qb_for_team = sorted(
    #         [
    #             p
    #             for p, player_data in players.items()
    #             if player_data["team"] == players[rbwrte]["team"]
    #             and player_data["pos"] == 66
    #         ],
    #         key=lambda x: players[x]["pts"],
    #     )[0]
    #     print("{} - {} || {} - {}".format(rbwrte, players[rbwrte]['team'], qb_for_team, players[qb_for_team]['team']))
    #     model += (
    #         lpSum(
    #             player_vars[i]
    #             for i, data in players.items()
    #             if data["team"] == players[rbwrte]["team"]
    #             and i != qb_for_team
    #             and data['pos'] != 71
    #         )
    #         <= 1
    #     )

    lineups = []
    for _ in range(constraints.count):
        model.solve()
        model += (
            lpSum(
                player_vars[int(p.name.split("_")[1])]
                for p in model.variables()
                if p.varValue > 0
            )
            <= 8
        )
        lineups.append(to_lineup(model))

    return lineups

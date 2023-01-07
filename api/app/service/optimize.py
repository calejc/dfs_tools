from pulp import LpMaximize, LpProblem, lpSum, LpVariable
from collections import Counter
from app.model.models import *
from app.model.draftkings_api_constants import (
    QB_ROSTER_SLOT_ID,
    RB_ROSTER_SLOT_ID,
    WR_ROSTER_SLOT_ID,
    TE_ROSTER_SLOT_ID,
    DST_ROSTER_SLOT_ID,
)


def query_player_by_id(player_id):
    return (
        db.session.query(DraftGroupPlayer)
        .filter(DraftGroupPlayer.id == player_id)
        .first()
    )


def query_player(player_var):
    return query_player_by_id(player_var.name.split("_")[1])


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


def base_constraints_and_objective(model, players, player_vars):
    model += lpSum([players[p]["pts"] * player_vars[p] for p in players.keys()])
    model += lpSum(player_vars.values()) == 9
    # model += (
    #     lpSum(
    #         [
    #             len(
    #                 set(
    #                     [
    #                         players[p]["team"]
    #                         for p in players.keys()
    #                         if player_vars[p] >= 1
    #                     ]
    #                 )
    #             )
    #         ]
    #     )
    #     >= 3
    # )


def salary_cap_constraint(model, players, player_vars):
    model += (
        lpSum([players[p]["sal"] * player_vars[p] for p in players.keys()]) <= 50000
    )


def single_positional_constraint(model, players, player_vars, position):
    model += (
        lpSum(
            [
                player_vars[p]
                for p, player_data in players.items()
                if player_data["pos"] == position
            ]
        )
        == 1
    )


def range_positional_constraint(model, players, player_vars, position, min, max):
    model += (
        lpSum(
            [
                player_vars[p]
                for p, player_data in players.items()
                if player_data["pos"] == position
            ]
        )
        >= min
    )
    model += (
        lpSum(
            [
                player_vars[p]
                for p, player_data in players.items()
                if player_data["pos"] == position
            ]
        )
        <= max
    )


def qb_constraints(model, players, player_vars):
    single_positional_constraint(model, players, player_vars, QB_ROSTER_SLOT_ID)


def dst_constraints(model, players, player_vars):
    single_positional_constraint(model, players, player_vars, DST_ROSTER_SLOT_ID)


def rb_constraints(model, players, player_vars, constraints):
    range_positional_constraint(
        model,
        players,
        player_vars,
        RB_ROSTER_SLOT_ID,
        constraints.min_rb,
        constraints.max_rb,
    )


def wr_constraints(model, players, player_vars, constraints):
    range_positional_constraint(
        model,
        players,
        player_vars,
        WR_ROSTER_SLOT_ID,
        constraints.min_wr,
        constraints.max_wr,
    )


def te_constraints(model, players, player_vars, constraints):
    range_positional_constraint(
        model,
        players,
        player_vars,
        TE_ROSTER_SLOT_ID,
        constraints.min_te,
        constraints.max_te,
    )


def positional_constraints(model, players, player_vars, constraints):
    qb_constraints(model, players, player_vars)
    dst_constraints(model, players, player_vars)
    rb_constraints(model, players, player_vars, constraints)
    wr_constraints(model, players, player_vars, constraints)
    te_constraints(model, players, player_vars, constraints)


def stacking_constraints(model, players, player_vars, constraints):
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


def max_per_team_constraints(model, players, player_vars, constraints):
    # FIXME: this should be updated to account for stack options.
    # Example: Stack set to 3 with QB, 2 bringbacks, and max_per_team set to 1. <- this should be solveable
    for rbwrte in [
        p
        for p in players
        if players[p]["pos"]
        in (RB_ROSTER_SLOT_ID, WR_ROSTER_SLOT_ID, TE_ROSTER_SLOT_ID)
    ]:
        qb_for_team = sorted(
            [
                p
                for p, player_data in players.items()
                if player_data["team"] == players[rbwrte]["team"]
                and player_data["pos"] == QB_ROSTER_SLOT_ID
            ],
            key=lambda x: players[x]["pts"],
        )[0]
        model += (
            lpSum(
                player_vars[i]
                for i, data in players.items()
                if data["team"] == players[rbwrte]["team"]
                and i != qb_for_team
                and data["pos"] != DST_ROSTER_SLOT_ID
            )
            <= constraints.max_per_team
        )


def new_lineup_constraint(model, player_vars, constraints):
    # Will not duplicate this result for additional solutions
    model += lpSum(
        player_vars[int(p.name.split("_")[1])]
        for p in model.variables()
        if p.varValue > 0
    ) <= (9 - constraints.unique)


def optimize(constraints: OptimizerConstraintsModel):
    players = {
        p["id"]: {
            "sal": p["salary"],
            "pts": p["projected"],
            "pos": p["roster_slot_id"],
            "team": p["team"]["abbr"],
            "opp": p["opp"]["abbr"],
        }
        for p in constraints.players
        if p.get("projected", None) is not None
    }
    player_vars = LpVariable.dicts("player", players.keys(), cat="Binary")
    model = LpProblem(name="optimize", sense=LpMaximize)

    base_constraints_and_objective(model, players, player_vars)
    salary_cap_constraint(model, players, player_vars)
    positional_constraints(model, players, player_vars, constraints)
    # max_per_team_constraints(model, players, player_vars, constraints)

    if constraints.stack.with_qb.stacking() or constraints.stack.opp.stacking():
        stacking_constraints(model, players, player_vars, constraints)

    lineups = []
    for _ in range(constraints.count):
        model.solve()
        new_lineup_constraint(model, player_vars, constraints)
        lineups.append(to_lineup(model))

    ctr = Counter()
    for lu in lineups:
        for p in lu:
            ctr[p.id] += 1
    resp = {
        "lineups": lineups,
        "exposure": sorted(
            [
                {
                    "team": {"logo": "/img/{}.png".format(players[i]["team"].lower())},
                    "player": query_player_by_id(i).player,
                    "exposure": round(ctr[i] / len(lineups) * 100, 2),
                }
                for i in ctr
            ],
            key=lambda x: x["exposure"],
            reverse=True,
        ),
    }
    return resp

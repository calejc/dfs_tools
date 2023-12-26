from pulp import LpMaximize, LpProblem, lpSum, LpVariable, PULP_CBC_CMD
from collections import Counter
from app.model.models import *
from app.model.draftkings_api_constants import (
    QB_ROSTER_SLOT_ID,
    RB_ROSTER_SLOT_ID,
    WR_ROSTER_SLOT_ID,
    TE_ROSTER_SLOT_ID,
    DST_ROSTER_SLOT_ID,
    FLEX_ROSTER_SLOT_ID
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

    sorted_lineup = [p for p in lineup if p != flex_player]
    sorted_lineup.sort(key=lambda x: x.roster_slot_id)
    sorted_lineup[7:7] = [flex_player]
    return sorted_lineup

    # TODO: disgusting, find a better way to get players in the correct lineup order
    # TODO: Maybe a class method on the player object that returns a sort order?
    # sorted_lineup = []
    # sorted_lineup += [p for p in lineup if p.roster_slot_id == QB_ROSTER_SLOT_ID]
    # sorted_lineup += [
    #     p for p in lineup if p.roster_slot_id == RB_ROSTER_SLOT_ID and p != flex_player
    # ]
    # sorted_lineup += [
    #     p for p in lineup if p.roster_slot_id == WR_ROSTER_SLOT_ID and p != flex_player
    # ]
    # sorted_lineup += [
    #     p for p in lineup if p.roster_slot_id == TE_ROSTER_SLOT_ID and p != flex_player
    # ]
    # sorted_lineup += [flex_player]
    # sorted_lineup += [p for p in lineup if p.roster_slot_id == DST_ROSTER_SLOT_ID]

    # return sorted_lineup


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
    model += (
        lpSum(
            [
                len(
                    set(
                        [
                            players[p]["team"]
                            for p in players.keys()
                            if player_vars[p] >= 1
                        ]
                    )
                )
            ]
        )
        >= 2
    )


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
    qb_for_team = [
        players[p]
        for p in players.keys()
        if player_vars[p] >= 1 and players[p]["pos"] == QB_ROSTER_SLOT_ID
    ][0]
    stack_teams = [qb_for_team["team"]]
    if constraints.stack.opp.stacking():
        stack_teams.append(qb_for_team["opp"])
    for team in set(
        [
            players[p]["team"]
            for p in players.keys()
            if player_vars[p] >= 1 and players[p]["team"] not in stack_teams
        ]
    ):
        model += (
            lpSum(
                [
                    player_vars[p]
                    for p, player_data in players.items()
                    if player_data["team"] == team
                ]
            )
            <= constraints.max_per_team
        )


def player_specific_constraints(model, players, player_vars):
    for id, p in players.items():
        if p["min"] == 100:
            model += lpSum([player_vars[id]]) >= 1


def new_lineup_constraint(model, player_vars, players, ctr, constraints):
    players_in_lineup = [
        player_vars[int(p.name.split("_")[1])]
        for p in model.variables()
        if p.varValue > 0
    ]

    # Once player has hit their max count based on max exposure constraint,
    # Set a model constraint so that the player will not appear in any more lineups
    for p in players_in_lineup:
        pid = int(p.name.split("_")[1])
        if ctr[pid] >= players[pid]["max_count"]:
            model += lpSum([p]) == 0

    # Add a constraint to the model with the players of this new lineup,
    # effectively making sure any additional lineups generated after will not duplicate this one.
    model += lpSum(players_in_lineup) <= (9 - constraints.unique)


def to_exposure_list_item(i, ctr, players, lineups):
    p = query_player_by_id(i)
    return {
        "team": {"logo": "/img/{}.png".format(players[i]["team"].lower())},
        "player": p.player,
        "rosterSlotId": p.roster_slot_id,
        "exposure": round(ctr[i] / len(lineups) * 100, 2),
    }


def to_exposure_range(i, ctr):
    pass


def max_count(max_pct, total_count):
    return int((max_pct / 100) * total_count)


def optimize(constraints: OptimizerConstraintsModel):
    players = {
        p["id"]: {
            "sal": p["salary"],
            "pts": p["projected"],
            "pos": p["roster_slot_id"],
            "team": p["team"]["abbr"],
            "game_id": p,
            "opp": p["opp"]["abbr"],
            "own": p["ownership"],
            "min": int(p["min"]),
            "max": int(p["max"]),
            "max_count": max_count(int(p["max"]), constraints.count),
        }
        for p in constraints.players
        if p["projected"] is not None and int(p["max"]) > 0
    }
    player_vars = LpVariable.dicts("player", players.keys(), cat="Binary")
    model = LpProblem(name="optimize", sense=LpMaximize)

    base_constraints_and_objective(model, players, player_vars)
    salary_cap_constraint(model, players, player_vars)
    positional_constraints(model, players, player_vars, constraints)
    player_specific_constraints(model, players, player_vars)
    # max_per_team_constraints(model, players, player_vars, constraints)

    if constraints.stack.with_qb.stacking() or constraints.stack.opp.stacking():
        stacking_constraints(model, players, player_vars, constraints)

    lineups = []
    ctr = Counter()
    for _ in range(constraints.count):
        model.solve(PULP_CBC_CMD(msg=0))
        new_lineup = to_lineup(model)
        for p in new_lineup:
            ctr[p.id] += 1
        lineups.append(new_lineup)
        new_lineup_constraint(model, player_vars, players, ctr, constraints)

    resp = {
        "lineups": lineups,
        "exposure": sorted(
            [to_exposure_list_item(i, ctr, players, lineups) for i in ctr],
            key=lambda x: x["exposure"],
            reverse=True,
        ),
    }
    return resp

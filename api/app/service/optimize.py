import re
from pulp import LpMaximize, LpProblem, lpSum, LpVariable, LpStatus
from app.model.models import *
from app import app


def summary(prob):
    div = "---------------------------------------\n"
    print(LpStatus[prob.status])
    print(div)
    print("Variables:\n")
    score = str(prob.objective)
    constraints = [str(const) for const in prob.constraints.values()]
    for v in prob.variables():
        score = score.replace(v.name, str(v.varValue))
        constraints = [const.replace(v.name, str(v.varValue)) for const in constraints]
        if v.varValue != 0:
            print(
                db.session.query(DraftGroupPlayer)
                .filter(DraftGroupPlayer.id == v.name.split("_")[1])
                .first()
                .player
            )
    print(div)
    print("Constraints:")
    for constraint in constraints:
        constraint_pretty = " + ".join(re.findall("[0-9\.]*\*1.0", constraint))
        if constraint_pretty != "":
            print("{} = {}".format(constraint_pretty, eval(constraint_pretty)))
    print(div)
    print("Score:")
    score_pretty = " + ".join(re.findall("[0-9\.]+\*1.0", score))
    print("{} = {}".format(score_pretty, eval(score)))


def pos_to_roster_slots(pos):
    if pos == "rb":
        return [67]
    elif pos == "wr":
        return [68]
    elif pos == "te":
        return [69]
    elif pos == "flex":
        return [67, 68, 69]
    elif pos == "wrte":
        return [68, 69]


def optimize(constraints: OptimizerConstraintsModel):
    SALARY_CAP = 50000
    POSITIONAL_CONSTRAINTS = {66: 1, 67: 2, 68: 3, 69: 1, 71: 1}
    FLEX = [67, 68, 69]
    print(constraints.draft_group_id)
    players = {
        p.id: {
            "sal": p.salary,
            "pts": p.ceiling,
            "pos": p.roster_slot_id,
            "team": p.team,
            "opp": p.opp,
        }
        for p in db.session.query(DraftGroupPlayer)
        .filter(
            DraftGroupPlayer.draft_group_id == constraints.draft_group_id,
            DraftGroupPlayer.roster_slot_id != 70,
        )
        .all()
        if p.ceiling is not None
    }
    player_vars = LpVariable.dicts("player", players.keys(), cat="Binary")
    model = LpProblem(name="optimize", sense=LpMaximize)

    if constraints.stack.with_qb.stacking() or constraints.stack.opp.stacking():
        for qb in [p for p in players if players[p]["pos"] == 66]:
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
                if player_data["pos"] == 67
            ]
        )
        >= 2
    )
    model += (
        lpSum(
            [
                player_vars[p]
                for p, player_data in players.items()
                if player_data["pos"] == 67
            ]
        )
        <= 3
    )

    # WR
    model += (
        lpSum(
            [
                player_vars[p]
                for p, player_data in players.items()
                if player_data["pos"] == 68
            ]
        )
        >= 3
    )
    model += (
        lpSum(
            [
                player_vars[p]
                for p, player_data in players.items()
                if player_data["pos"] == 68
            ]
        )
        <= 4
    )

    # TE
    # teSum = [
    # player_vars[p] for p, player_data in players.items() if player_data["pos"] == 69
    # ]
    model += (
        lpSum(
            [
                player_vars[p]
                for p, player_data in players.items()
                if player_data["pos"] == 69
            ]
        )
        == 1
    )
    # model += (
    #     lpSum(
    #         [
    #             player_vars[p]
    #             for p, player_data in players.items()
    #             if player_data["pos"] == 69
    #         ]
    #     )
    #     <= 2
    # )

    # QB
    model += (
        lpSum(
            [
                player_vars[p]
                for p, player_data in players.items()
                if player_data["pos"] == 66
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
                if player_data["pos"] == 71
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

    # model += (
    #     lpSum(player_vars[25194822]) == 1
    # )

    # model += (
    #     lpSum(
    #         [
    #             player_vars[p]
    #             for p, player_data in players.items()
    #             if player_data["sal"] == 3000
    #         ]
    #     )
    #     == 0
    # )
    # model += (
    #     lpSum(player_vars[25195120])
    #     == 0
    # )

    model.solve()
    summary(model)

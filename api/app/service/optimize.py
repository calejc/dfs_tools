import re
from pulp import LpMaximize, LpProblem, lpSum, LpVariable
from app.model.models import *
from app import app


def name(p):
    if p.roster_slot_id == 71:
        return p.player.name
    else:
        return p.player.full_name


def summary(prob):
    div = "---------------------------------------\n"
    print("Variables:\n")
    score = str(prob.objective)
    constraints = [str(const) for const in prob.constraints.values()]
    for v in prob.variables():
        score = score.replace(v.name, str(v.varValue))
        constraints = [const.replace(v.name, str(v.varValue)) for const in constraints]
        if v.varValue != 0:
            print(
                name(
                    db.session.query(DraftGroupPlayer)
                    .filter(DraftGroupPlayer.id == v.name.split("_")[1])
                    .first()
                )
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


def optimize():
    SALARY_CAP = 50000
    POSITIONAL_CONSTRAINTS = {66: 1, 67: 2, 68: 3, 69: 1, 71: 1}
    FLEX = [67, 68, 69]
    players = {
        p.id: {
            "sal": p.salary,
            "pts": p.ceiling,
            "pos": p.roster_slot_id,
            "team": p.team_id,
        }
        for p in db.session.query(DraftGroupPlayer)
        .filter(
            DraftGroupPlayer.draft_group_id == 76225,
            DraftGroupPlayer.roster_slot_id != 70,
        )
        .all()
        if p.ceiling is not None
    }
    print(players)
    player_vars = LpVariable.dicts("player", players.keys(), cat="Binary")
    model = LpProblem(name="testing", sense=LpMaximize)
    model += lpSum([players[p]["pts"] * player_vars[p] for p in players.keys()])
    model += (
        lpSum([players[p]["sal"] * player_vars[p] for p in players.keys()])
        <= SALARY_CAP
    )
    model += lpSum([player_vars[p] for p in players.keys()]) == 9

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
        <= 2
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
    teSum = [
        player_vars[p] for p, player_data in players.items() if player_data["pos"] == 69
    ]
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
    model += (
        lpSum(
            [
                player_vars[p]
                for p, player_data in players.items()
                if player_data["pos"] == 69
            ]
        )
        <= 2
    )

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

    # for qb in [p for p in players if players[p]["pos"] == 66]:
    # print(qb)
    # model += lpSum(
    # [player_vars[i] for i, data in players.items() if data['team'] == players[qb]['team']] + [-3*player_vars[qb]]
    # ) >= 0
    # 24927816
    model += lpSum(player_vars[24927739]) == 1
    model += lpSum(player_vars[24928154]) == 1
    model += (
        lpSum(
            player_vars[24928088]
            + player_vars[24928108]
            + player_vars[24928510]
            + player_vars[24928518]
        )
        == 4
    )
    model += (
        lpSum(player_vars[24928130] + player_vars[24928114] + player_vars[24928186])
        == 0
    )

    model.solve()
    summary(model)

import csv
from app.model.csv_mappings import *
from app.model.models import *
from requests.structures import CaseInsensitiveDict
from app import app
from app.model.draftkings_api_constants import SD_CPT_ROSTER_SLOT_ID


def read_file_contents(file):
    return csv.reader(file.read().decode("utf-8").splitlines())


def map_value(row, mapping, field, default):
    return (
        mapping.extract_csv_value(row, field)
        if mapping.extract_csv_value(row, field) is not None
        else default
    )


def parse_row_to_projection_model(source, row, mapping, draft_group_id, is_showdown):
    draft_group_players = mapping.get_draft_group_players(
        row, draft_group_id, db.session
    )

    if not draft_group_players:
        return []

    if is_showdown:
        for player in draft_group_players:
            existing_projection = [
                proj for proj in player.projections if proj.source == source
            ]
            proj = None
            if existing_projection:
                proj = existing_projection[0]
                proj.base = map_value(row, mapping, mapping.base, proj.base)
                proj.ceiling = map_value(row, mapping, mapping.ceiling, proj.ceiling)
            else:
                proj = Projection(
                    source=ProjectionSource(source).name,
                    base=mapping.extract_csv_value(row, mapping.base),
                    ceiling=mapping.extract_csv_value(row, mapping.ceiling),
                )

            if player.roster_slot_id == SD_CPT_ROSTER_SLOT_ID:
                proj.optimal = map_value(row, mapping, mapping.cpt_rate, proj.optimal)
                proj.base = float(proj.base) * 1.5 if proj.base else None
                proj.ceiling = float(proj.ceiling) * 1.5 if proj.ceiling else None
                proj.ownership = map_value(
                    row, mapping, mapping.cpt_ownership, proj.ownership
                )
            else:
                proj.optimal = map_value(row, mapping, mapping.flex_rate, proj.optimal)
                proj.ownership = mapping.get_flex_own(row)

            player.projections.append(proj)
        return draft_group_players

    else:
        draft_group_player = draft_group_players[0]
        existing_projection = [
            proj for proj in draft_group_player.projections if proj.source == source
        ]
        if existing_projection:
            proj = existing_projection[0]
            proj.base = map_value(row, mapping, mapping.base, proj.base)
            proj.median = map_value(row, mapping, mapping.median, proj.median)
            proj.ceiling = map_value(row, mapping, mapping.ceiling, proj.ceiling)
            proj.value = map_value(row, mapping, mapping.value, proj.value)
            proj.boom = map_value(row, mapping, mapping.boom, proj.boom)
            proj.optimal = map_value(row, mapping, mapping.optimal, proj.optimal)
            proj.ownership = map_value(row, mapping, mapping.ownership, proj.ownership)
        else:
            draft_group_player.projections.append(
                Projection(
                    source=ProjectionSource(source).name,
                    base=mapping.extract_csv_value(row, mapping.base),
                    median=mapping.extract_csv_value(row, mapping.median),
                    ceiling=mapping.extract_csv_value(row, mapping.ceiling),
                    value=mapping.extract_csv_value(row, mapping.value),
                    boom=mapping.extract_csv_value(row, mapping.boom),
                    optimal=mapping.extract_csv_value(row, mapping.optimal),
                    ownership=mapping.extract_csv_value(row, mapping.ownership),
                )
            )

        return [draft_group_player]


def get_column_mapping(source):
    if source == ProjectionSource.ESTABLISH_THE_RUN.value:
        return EstablishTheRunColumns()
    elif source == ProjectionSource.RUN_THE_SIMS.value:
        return RunTheSimsColumns()
    elif source == ProjectionSource.OTHER.value:
        return GenericColumns()
    else:
        raise ValueError("Not a valid projection source.")


def file_rows_to_projection_entities(rows, source, draft_group_id):
    mapping = get_column_mapping(source)
    is_showdown = (
        db.session.query(DraftGroup)
        .filter(DraftGroup.id == draft_group_id)
        .first()
        .type
        == SlateType.SHOWDOWN
    )
    return [
        flattened_value
        for sub_list in [
            parse_row_to_projection_model(
                source, CaseInsensitiveDict(row), mapping, draft_group_id, is_showdown
            )
            for row in rows
        ]
        for flattened_value in sub_list
    ]


def handle_file_upload(file, source, draft_group_id):
    data = [line for line in read_file_contents(file)] if file else []
    data[0][0] = data[0][0].strip('\ufeff"')
    file_rows_as_dicts = [dict(zip(data[0], line)) for line in data[1:]]
    with app.app_context():
        db.session.add_all(
            file_rows_to_projection_entities(file_rows_as_dicts, source, draft_group_id)
        )
        db.session.commit()

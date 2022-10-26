import csv
from app.model.csv_mappings import *
from app.model.models import *
from app import app


def read_file_contents(file):
    return csv.reader(file.read().decode("utf-8").splitlines())


def parse_row_to_projection_model(row, mapping, draft_group_id):
    projection = Projection(
        source=ProjectionSource.ESTABLISH_THE_RUN.value,
        base=row.get(mapping.base, None),
        median=row.get(mapping.median, None),
        ceiling=row.get(mapping.ceiling, None),
        value=row.get(mapping.value, None),
        etr_value=row.get(mapping.etr_value, None),
        boom=row.get(mapping.boom, None),
        optimal=row.get(mapping.optimal, None),
        ownership=mapping.get_ownership(row),
    )

    draft_group_players = mapping.get_draft_group_players(
        row, draft_group_id, db.session
    )

    [dgp.projections.append(projection) for dgp in draft_group_players]
    return draft_group_players


def get_column_mapping(source):
    if source == ProjectionSource.ESTABLISH_THE_RUN.value:
        return EstablishTheRunColumns()
    elif source == ProjectionSource.RUN_THE_SIMS.value:
        return RunTheSimsColumns()
    elif source == ProjectionSource.ONE_WEEK_SEASON.value:
        return OneWeekSeasonColumns()
    elif source == ProjectionSource.DAILY_ROTO.value:
        return DailyRotoColumns()
    elif source == ProjectionSource.OTHER.value:
        return GenericColumns()
    else:
        raise ValueError("Not a valid projection source.")


def file_rows_to_projection_entities(rows, source, draft_group_id):
    mapping = get_column_mapping(source)
    return [
        flattened_value
        for sub_list in [
            parse_row_to_projection_model(row, mapping, draft_group_id) for row in rows
        ]
        for flattened_value in sub_list
    ]


def handle_file_upload(file, source, draft_group_id):
    data = [line for line in read_file_contents(file)] if file else []
    file_rows_as_dicts = [dict(zip(data[0], line)) for line in data[1:]]
    with app.app_context():
        db.session.add_all(
            file_rows_to_projection_entities(file_rows_as_dicts, source, draft_group_id)
        )
        db.session.commit()

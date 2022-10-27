import csv
from dataclasses import asdict, fields
from app.model.csv_mappings import *
from app.model.models import *
from app import app


def read_file_contents(file):
    return csv.reader(file.read().decode("utf-8").splitlines())


def parse_row_to_projection_model(source, row, mapping, draft_group_id):
    draft_group_players = mapping.get_draft_group_players(
        row, draft_group_id, db.session
    )

    if not draft_group_players:
        return []

    new_projection = Projection(
        source=ProjectionSource(source).name,
        base=mapping.extract_value(row, mapping.base),
        median=mapping.extract_value(row, mapping.median),
        ceiling=mapping.extract_value(row, mapping.ceiling),
        value=mapping.extract_value(row, mapping.value),
        etr_value=mapping.extract_value(row, mapping.etr_value),
        boom=mapping.extract_value(row, mapping.boom),
        optimal=mapping.extract_value(row, mapping.optimal),
        ownership=mapping.extract_value(row, mapping.ownership),
        cpt_rate=mapping.extract_value(row, mapping.cpt_rate),
        flex_rate=mapping.extract_value(row, mapping.flex_rate),
    )
    existing_projection = [
        proj for proj in draft_group_players[0].projections if proj.source == source
    ]
    if existing_projection:
        proj = existing_projection[0]
        proj.base = (
            mapping.extract_value(row, mapping.base)
            if mapping.extract_value(row, mapping.base) is not None
            else proj.base
        )
        proj.median = (
            mapping.extract_value(row, mapping.median)
            if mapping.extract_value(row, mapping.median) is not None
            else proj.median
        )
        proj.ceiling = (
            mapping.extract_value(row, mapping.ceiling)
            if mapping.extract_value(row, mapping.ceiling) is not None
            else proj.ceiling
        )
        proj.value = (
            mapping.extract_value(row, mapping.value)
            if mapping.extract_value(row, mapping.value) is not None
            else proj.value
        )
        proj.etr_value = (
            mapping.extract_value(row, mapping.etr_value)
            if mapping.extract_value(row, mapping.etr_value) is not None
            else proj.etr_value
        )
        proj.boom = (
            mapping.extract_value(row, mapping.boom)
            if mapping.extract_value(row, mapping.boom) is not None
            else proj.boom
        )
        proj.optimal = (
            mapping.extract_value(row, mapping.optimal)
            if mapping.extract_value(row, mapping.optimal) is not None
            else proj.optimal
        )
        proj.ownership = (
            mapping.extract_value(row, mapping.ownership)
            if mapping.extract_value(row, mapping.ownership) is not None
            else proj.ownership
        )
        proj.cpt_rate = (
            mapping.extract_value(row, mapping.cpt_rate)
            if mapping.extract_value(row, mapping.cpt_rate) is not None
            else proj.cpt_rate
        )
        proj.flex_rate = (
            mapping.extract_value(row, mapping.flex_rate)
            if mapping.extract_value(row, mapping.flex_rate) is not None
            else proj.flex_rate
        )
    else:
        [dgp.projections.append(new_projection) for dgp in draft_group_players]

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
            parse_row_to_projection_model(source, row, mapping, draft_group_id)
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

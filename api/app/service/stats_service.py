import csv
from app.model.models import *
from app import app


def read_file_contents(file):
    return csv.reader(file.read().decode("utf-8").splitlines())


def parse_etr_to_projection_model(row):
    return Projection(
        source=ProjectionSource.ONE_WEEK_SEASON,
        median=row["dk_perc_50"],
        ceiling=row["dk_perc_80"],
        ownership=row["dk_ownership"],
    )


def extract_and_format_rts_ownership(row):
    ownership = row["Proj Own"] if row.has_key("Proj Own") else row["projOwn"]
    if "%" in ownership:
        return int(ownership.split("%")[0])
    else:
        return int(ownership) * 100


def parse_rts_to_projection_model(row):
    return Projection(
        source=ProjectionSource.ONE_WEEK_SEASON,
        base=row["Base Projection"],
        median=row["Projection 50%"],
        ceiling=row["Projection Ceil"],
        value=row["Pts/$"],
        boom=row["Boom Rate"],
        optimal=row["Optimal Rates"],
        ownership=extract_and_format_rts_ownership(row),
    )


def parse_ows_to_projection_model(row):
    return Projection(
        source=ProjectionSource.ONE_WEEK_SEASON,
        median=row["dk_perc_50"],
        ceiling=row["dk_perc_80"],
        ownership=row["dk_ownership"],
    )


def parse_other_to_projection_model(row):
    pass


def file_rows_to_projection_entities(rows, source):
    if source is ProjectionSource.ESTABLISH_THE_RUN:
        return [parse_etr_to_projection_model(row) for row in rows]
    elif source is ProjectionSource.RUN_THE_SIMS:
        return [parse_rts_to_projection_model(row) for row in rows]
    elif source is ProjectionSource.ONE_WEEK_SEASON:
        return [parse_ows_to_projection_model(row) for row in rows]
    elif source is ProjectionSource.OTHER:
        return [parse_other_to_projection_model(row) for row in rows]
    else:
        raise ValueError("Not a valid projection source.")


def handle_file_upload(file, source):
    data = [line for line in read_file_contents(file)] if file else []
    file_rows_as_dicts = [dict(zip(data[0], line)) for line in data]
    with app.app_context():
        db.session.add_all(file_rows_to_projection_entities(file_rows_as_dicts, source))
        db.session.commit()

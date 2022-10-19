import csv
from app.model.models import *


def read_file_contents(file):
    return csv.reader(file.read().decode("utf-8").splitlines())


def do_thing_with_upload(file):
    data = [line for line in read_file_contents(file)] if file else []
    lines = [dict(zip(data[0], line)) for line in data]
    print(*lines, sep="\n\n")

from datetime import datetime
from flask.json import JSONEncoder


class CustomJSONEncoder(JSONEncoder):
    """
    Custom JSONEncoder to serialize datetimes into a usable format for the UI.
    """

    def default(self, o):
        if isinstance(o, datetime):
            return o.isoformat()

        return super().default(o)

"""The JSON the package is built from, read once at import.

Every file under data/ is written by `brock apworld build` from the game's own
export. Nothing here is written by hand, and the package holds no game data.
"""
import json
import pkgutil


def _load(name: str):
    raw = pkgutil.get_data(__name__, f"data/{name}")
    if raw is None:
        raise FileNotFoundError(f"apworld: data/{name} is missing from the package")
    return json.loads(raw.decode("utf-8"))


GAME_DATA = _load("game.json")
LOCATIONS = _load("locations.json")
REGIONS = _load("regions.json")
ITEMS = _load("items.json")
RULES = _load("rules.json")
OPTIONS = _load("options.json")

GAME: str = GAME_DATA["game"]
WORLD_VERSION: str = GAME_DATA["worldVersion"]
GOAL_EVENT: str = GAME_DATA["goalEvent"]

"""The profile's world model, read from the player file's `pre_rolled` option.

The app builds the model from the same fill world its local generator builds:
which locations exist, what is locked where, the pool, and the setting readings
and seed values the rules read. This package never derives any of that from the
options itself, so a player file without the model, or one whose options were
edited after the app wrote it, is refused with a message that says so.

Required keys: options, present, locked, pool, readings, seedValues, fillerItem.
Optional keys: classes, forbidden, primitives.
"""
from Options import OptionError

from .options import app_value_of

MODEL_KEYS = ("options", "present", "locked", "pool", "readings", "seedValues", "fillerItem")


def model_of(world) -> dict:
    """The validated model, or an OptionError naming what is wrong."""
    player = world.player_name
    pre_rolled = world.options.pre_rolled.value or {}
    model = pre_rolled.get("world")
    if not isinstance(model, dict):
        raise OptionError(
            f"{player}: the player file has no pre_rolled world. Save the Archipelago files from the app, "
            "which writes it from the profile.")
    missing = [key for key in MODEL_KEYS if key not in model]
    if missing:
        raise OptionError(f"{player}: pre_rolled.world is missing {missing}; the app that wrote it is too old.")
    if not world.options.seed_text.value:
        raise OptionError(f"{player}: the player file has no seed_text, the seed pre_rolled was rolled from.")
    changed = []
    for key, expected in model["options"].items():
        option = getattr(world.options, key, None)
        if option is None:
            continue
        actual = app_value_of(key, option)
        if actual is not None and actual != expected:
            changed.append(f"{key}: file says {actual!r}, pre_rolled was built for {expected!r}")
    if changed:
        raise OptionError(
            f"{player}: options differ from the ones pre_rolled was built for. Save the files from the app "
            "again after changing options. " + "; ".join(changed[:5]))
    return model


def slot_pre_rolled(world) -> dict:
    """Every pre_rolled value except the world model, handed back to the client through slot data."""
    pre_rolled = world.options.pre_rolled.value or {}
    return {key: value for key, value in pre_rolled.items() if key != "world"}

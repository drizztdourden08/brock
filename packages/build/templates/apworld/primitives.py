"""The primitive helpers a rule calls: a table the world model carries, never code.

A primitive is a helper whose arithmetic lives in the game's TypeScript (a
capacity ladder, a sum of hearts). The exporter cannot turn that into a rule
tree, so the app evaluates it into one per call and writes the trees under
`pre_rolled.world.primitives`, keyed by the call spelled `name(arg,arg)`. This
module finds the tree for the call a rule makes. A world without primitive
calls needs nothing here.
"""
from .data import GAME


def _spell(value) -> str:
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value)


def call_key(name: str, args: list) -> str:
    return f"{name}({','.join(_spell(arg) for arg in args)})"


def primitive_tree(model: dict, name: str, args: list) -> dict:
    """The rule tree the model holds for one primitive call, or a KeyError naming the call."""
    key = call_key(name, args)
    trees = model.get("primitives", {})
    if key not in trees:
        raise KeyError(f"{GAME}: pre_rolled.world.primitives has no tree for the primitive call {key}")
    return trees[key]

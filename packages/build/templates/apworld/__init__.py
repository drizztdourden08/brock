"""A generic Archipelago world, a loader and nothing more.

The locations, regions, rule trees, items and options are written as JSON by the
game's own export (`brock apworld build` copies them into data/), and everything
one profile settles (which locations exist, the pool, the readings and seed
values the rules read) arrives in the player file under `pre_rolled`, written
by the app. The game name comes from data/game.json.
"""
from BaseClasses import Item
from worlds.AutoWorld import WebWorld, World

from .data import GAME, GOAL_EVENT, REGIONS, WORLD_VERSION
from .items import ITEM_NAME_TO_ID, KEY_BY_NAME, WorldItem, make_event_item, make_item, name_of_item
from .locations import LOCATION_BY_KEY, LOCATION_NAME_TO_ID
from .model import model_of, slot_pre_rolled
from .options import WorldOptions
from .regions import create_regions
from .rules import RuleCompiler


class GenericWeb(WebWorld):
    tutorials: list = []


class GenericWorld(World):
    """The randomizer of the game that exported this world, in a multiworld."""

    game = GAME
    web = GenericWeb()
    options_dataclass = WorldOptions
    item_name_to_id = ITEM_NAME_TO_ID
    location_name_to_id = LOCATION_NAME_TO_ID
    origin_region_name = REGIONS["start"]
    # Rules read region and location reachability from inside passage rules, so every
    # passage is rechecked when the reachable set grows.
    explicit_indirect_conditions = False
    topology_present = True

    def generate_early(self) -> None:
        self.model = model_of(self)

    def create_item_by_key(self, key: str) -> WorldItem:
        return make_item(key, self.player, self.model)

    def create_item(self, name: str) -> Item:
        return self.create_item_by_key(KEY_BY_NAME.get(name, name))

    def get_filler_item_name(self) -> str:
        return name_of_item(self.model["fillerItem"])

    def create_regions(self) -> None:
        self.locations_by_key, self.events_by_key = create_regions(self, self.model)

    def create_items(self) -> None:
        model = self.model
        # Each story event of the world is an Archipelago event: its location, locked to the item of its name.
        for key, location in self.events_by_key.items():
            location.place_locked_item(make_event_item(key, self.player))
        for key, item in model["locked"].items():
            self.locations_by_key[key].place_locked_item(self.create_item_by_key(item))
        for key, count in model["pool"].items():
            self.multiworld.itempool += [self.create_item_by_key(key) for _ in range(count)]

    def set_rules(self) -> None:
        compiler = RuleCompiler(self, self.model)
        for exit_row in REGIONS["exits"]:
            rule = compiler.compile(exit_row["rule"])
            compiler.exit_rules[exit_row["name"]] = rule
            self.get_entrance(exit_row["name"]).access_rule = rule
        for key, location in self.locations_by_key.items():
            location.access_rule = compiler.compile(LOCATION_BY_KEY[key]["rule"])
            location.item_rule = self._item_rule(key)
        for event_row in REGIONS["events"]:
            self.events_by_key[event_row["key"]].access_rule = compiler.compile(event_row["rule"])
        goal = name_of_item(GOAL_EVENT)
        self.multiworld.completion_condition[self.player] = lambda state: state.has(goal, self.player)

    def _item_rule(self, key: str):
        """The engine's placement predicate for one location: the items the model forbids there."""
        refused = {name_of_item(item) for item in self.model.get("forbidden", {}).get(key, [])}
        player = self.player
        return lambda item: item.player != player or item.name not in refused

    def fill_slot_data(self) -> dict:
        return {
            "worldVersion": WORLD_VERSION,
            "seed": self.options.seed_text.value,
            "options": self.model["options"],
            "preRolled": slot_pre_rolled(self),
        }

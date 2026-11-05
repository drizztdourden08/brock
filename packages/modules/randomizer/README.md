<!-- @layer docs @kind doc -->
# @drizztdourden08/brock-randomizer

A seeded item randomizer core with no game in it. The game supplies its world (regions, locations,
items, rule nodes, helpers) and a few hooks. This package supplies the engine.

Install it with `brock add randomizer`. Today it ships one subpath.

## `./world`

| Folder | Holds |
|---|---|
| `types` | `WorldKeys`, `World`, `RuleNode`, `CollectionState`, `HelperDefinition`, fill and game types. All generic over `WorldKeys`. |
| `rng` | `createRng`, `hashSeed`, `mulberry32`. The draw order is part of the contract: a seed gives one placement. |
| `util` | `itemAt`, a checked list read. |
| `io` | `isOptionsSnapshot` and `isStoredPlacement`, with the schema names passed in. |
| `rules`, `state`, `fill`, `generate`, `define` | Rule compile, collection state, restrictive fill, the attempt loop and the declarative game definition. |

The `worldSchema` of a world definition is a version tag the game owns, such as `'rotp-world-v1'`. Bump it when locations, items or regions change so placements stored from an older world are recognized.

`createWorldKit<K>()` returns the rule builders, the rule combinators, `always`, `never` and `mainFill` bound to your world keys, so `kit.has('sword')` is checked against `K['holding']` with no type argument.

Licence notes are in `NOTICE.md` and `LICENSE-world`.

## `./tracker`

| Export | Holds |
|---|---|
| Types | `TrackerProvider`, `TrackerInput`, `TrackerReading`, `TrackerCounts`, `LocationStatus`, `TrackerAssumption`, `TrackerGrouping`, `VanillaPlacement`, `DefTrackerExtras`, `TrackerFile`. |
| `TRACKER_SCHEMA` | The schema tag of the marks file, `tracker-v1`. |

A game gives a `TrackerProvider` as `RandomizerGame.tracker`. Brock reads one status per location from it: checked, available or blocked.

## `./archipelago`

| Export | Holds |
|---|---|
| Types | `ArchipelagoSocket`, `OnlineHost`, `OnlineConnection`, `ReceivedItem`, `ScoutedLocation`, `ScoutedInput`, `SlotReading`, `ArchipelagoClient`, `DataPackageCache`, `NetworkStatus`, `RoomMessage`, `ProbeResult` and the Archipelago packet types. |
| `ARCHIPELAGO_PROTOCOL_VERSION` | The protocol version sent when the game gives none. |

A game gives an `ArchipelagoGame` as `RandomizerGame.archipelago`. The client is pure TypeScript and talks to the game only through `OnlineHost`.

## Archipelia

A game that joins Archipelia gives an `ArchipeliaGame` as `ArchipelagoGame.archipelia`: the apworld module name, the world version, the client identity, a `playerFile` builder and two optional hooks. `./archipelago` then carries the lobby client, the world export, the id lookups and the player YAML. `./renderer` carries the membership, watch, join and browse helpers.

The `./preload` subpath adds `window.api.randomizer`: a lobby socket (`open`, `send`, `close`, `onEvent`) and `saveArchipelagoFiles`. The main module registers the four channels behind it. An app that adds this module also lists `@drizztdourden08/archipelia-lobby-protocol` in its own package.json for the main bundle.

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

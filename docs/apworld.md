<!-- @layer docs @kind doc -->
# Building an Archipelago world

An Archipelago server imports a small Python package, an apworld, for every game it hosts. Brock ships that package as a generic loader, so a game never writes Python. The loader reads the game's own JSON export and nothing else.

## What you need

- `@drizztdourden08/brock-randomizer` in the app, with an `ApExportSource` for the game (the module's `./archipelago` export).
- `brock apworld build`, from `@drizztdourden08/brock-build`.

## Write the JSON export

Call `exportApWorld(source)` from `@drizztdourden08/brock-randomizer/archipelago`. It returns six files as a map from file name to data: `game.json`, `locations.json`, `regions.json`, `items.json`, `rules.json` and `options.json`. Write each one into a folder, by default `build/apworld-data` in the app. You do not need a script of your own. `brock apworld export` does it.

```sh
brock apworld export --entry packages/game-core/src/randomizer/archipelago/index.ts --fn exportCtWorld
```

`--entry` is the game's TypeScript file and `--fn` is the function it exports. The function takes nothing and returns the six files as a map from file name to data. The command loads the entry with the app's own Vite, as a module loader only, so the app needs no extra dependency. It writes the files to `--ap-data` (default `build/apworld-data`).

## Build the apworld

```sh
brock apworld build --ap-version 0.6.2 --ap-version 0.6.3
```

Give each Archipelago version you support, oldest first. The first and last set the supported range. The command copies the loader, adds the JSON under `data/`, and writes one `.apworld` per version, a copy of the newest named `<module>.apworld`, and an index file, into `build/archipelago`.

| Option | Default |
|---|---|
| `--ap-data <dir>` | `build/apworld-data` |
| `--ap-out <dir>` | `build/archipelago` |
| `--ap-module <name>` | `product.id` from `brock.config.ts`, as a Python name |
| `--ap-author <name>` | `product.name` |
| `--ap-public <dir>` | none; with it, each build is also copied to `<dir>/<version>/<module>.apworld` with a `builds.json` index |

The app version comes from the app's `package.json`. The game name and world version come from `game.json`. The command finds the Archipelia client kit through the randomizer module, so the app needs no extra dependency.

## Rebuild only when needed

```sh
brock apworld ensure --entry <ts file> --fn <export name> --ap-version 0.6.2
```

`ensure` takes the options of `export` and `build`. It compares the built `<module>.apworld` with the newest file under each `--ap-source` folder (repeat it; the default is the entry's folder), the app's `package.json` and the loader. When nothing is newer it prints `up to date` and does nothing. Otherwise it runs export, then build.

## Write a player file

```sh
brock apworld player-file --entry <ts file> --fn <export name> --name Hero --out build/hero.yaml
```

The function gets one object: `slotName` (from `--name`), `options` (values from a `--options <file.json>` and from repeated `--set key=value`), `seedText` (from `--seed`, default the slot name) and `appVersion` (from `package.json`). It returns the yaml text, or an object with a `yaml` string. The command writes it to `--out`.

## What the player file carries

The loader never works out the world itself. The app writes the player file with a `pre_rolled.world` value built from the same fill world its local generator builds. Required keys:

- `options`: the option values the world was built for. A file edited after the app wrote it is refused.
- `present`: the keys of the locations that exist.
- `locked`: location key to the item key locked there.
- `pool`: item key to a count, the items the fill places.
- `readings`: the setting readings the rules test.
- `seedValues`: the rolled values the rules read.
- `fillerItem`: the item key used as filler.

Optional keys: `classes` (item key to a classification), `forbidden` (location key to item keys it refuses) and `primitives`.

## Primitive helpers

A primitive is a helper whose logic lives in your TypeScript, such as a capacity ladder. The exporter lists its name but cannot turn it into a rule. The app evaluates each call into a rule tree and writes it under `pre_rolled.world.primitives`, keyed by the call, for example `walletAtLeast(300)`. A world with no primitives needs nothing here.

## Limits

The loader covers rules, regions, events, items, locations, options and a locked or pooled item set. A game that needs its own fill passes (prizes, dungeon items) or custom collect logic needs more than this loader gives.

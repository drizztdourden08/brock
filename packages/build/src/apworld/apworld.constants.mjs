/* @layer tooling-scripts @kind constants */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const APWORLD_USAGE = `Usage: brock apworld export --entry <ts file> --fn <export name> [--ap-data <dir>]
  brock apworld refresh --entry <ts file> --fn <export name> --ap-version <v>... [--ap-source <dir>...] [build options]
  brock apworld player-file --entry <ts file> --fn <export name> --name <slot> --out <file.yaml> [--seed <text>] [--options <file.json>] [--set key=value...]
  brock apworld build --ap-version <v>... [--ap-data <dir>] [--ap-out <dir>] [--ap-module <name>] [--ap-author <name>] [--ap-public <dir>]
  Packs an Archipelago world from the game's JSON export: the generic Python loader that ships with brock-build
  plus the six JSON files in --ap-data (default build/apworld-data: game, locations, regions, items, rules, options).
  --ap-version  an Archipelago version to build for; repeat it, oldest first (the first and last set the supported range)
  --ap-out      where the .apworld files and the index go (default build/archipelago)
  --ap-module   the Python module name (default product.id with letters, digits and underscores only)
  --ap-author   the world's author (default product.name)
  --ap-public   also copy each build to <dir>/<ap version>/<module>.apworld with a builds.json index
  export        calls the named function of the game entry (a TypeScript file) and writes the six JSON files to --ap-data
  refresh       runs export and build only when --ap-source (default: the entry folder), package.json or the loader is newer than the built apworld
  player-file   calls the named function with { slotName, options, seedText, appVersion } and writes the yaml it returns`;

const TEMPLATE_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates', 'apworld');
const EXPORT_FILES = ['game.json', 'locations.json', 'regions.json', 'items.json', 'rules.json', 'options.json'];
const DEFAULT_DATA_DIR = 'build/apworld-data';
const DEFAULT_OUT_DIR = 'build/archipelago';
const KIT_PACKAGE = '@drizztdourden08/archipelia-client-kit/node';
const KIT_VIA = '@drizztdourden08/brock-randomizer/package.json';

export { APWORLD_USAGE, DEFAULT_DATA_DIR, DEFAULT_OUT_DIR, EXPORT_FILES, KIT_PACKAGE, KIT_VIA, TEMPLATE_DIR };

/* @layer tooling-scripts @kind constants */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const APWORLD_USAGE = `Usage: brock apworld build --ap-version <v>... [--ap-data <dir>] [--ap-out <dir>] [--ap-module <name>] [--ap-author <name>] [--ap-public <dir>]
  Packs an Archipelago world from the game's JSON export: the generic Python loader that ships with brock-build
  plus the six JSON files in --ap-data (default build/apworld-data: game, locations, regions, items, rules, options).
  --ap-version  an Archipelago version to build for; repeat it, oldest first (the first and last set the supported range)
  --ap-out      where the .apworld files and the index go (default build/archipelago)
  --ap-module   the Python module name (default product.id with letters, digits and underscores only)
  --ap-author   the world's author (default product.name)
  --ap-public   also copy each build to <dir>/<ap version>/<module>.apworld with a builds.json index`;

const TEMPLATE_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates', 'apworld');
const EXPORT_FILES = ['game.json', 'locations.json', 'regions.json', 'items.json', 'rules.json', 'options.json'];
const DEFAULT_DATA_DIR = 'build/apworld-data';
const DEFAULT_OUT_DIR = 'build/archipelago';
const KIT_PACKAGE = '@drizztdourden08/archipelia-client-kit/node';
const KIT_VIA = '@drizztdourden08/brock-randomizer/package.json';

export { APWORLD_USAGE, DEFAULT_DATA_DIR, DEFAULT_OUT_DIR, EXPORT_FILES, KIT_PACKAGE, KIT_VIA, TEMPLATE_DIR };

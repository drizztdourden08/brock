/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { addonPathsOf, readPins } from '../ensure-addon/index.mjs';
import { LOG_TAG } from '../ensure-addon/addon.constants.mjs';
import { fetchSdl3Source } from '../ensure-addon/fetch-sdl3-source.mjs';

const log = (message) => console.log(`${LOG_TAG} ${message}`);
const paths = addonPathsOf(resolve(import.meta.dirname, '..'));
const pins = readPins(paths.nativeDir);
const sourceDir = join(paths.thirdPartyDir, `SDL3-${pins.sdl3Version}`);

try {
  if (existsSync(join(sourceDir, 'CMakeLists.txt'))) log(`SDL ${pins.sdl3Version} source: ${sourceDir}`);
  else log(`SDL ${pins.sdl3Version} source fetched to ${await fetchSdl3Source({ paths, pins, force: false, log })}`);
} catch (error) {
  console.error(`${LOG_TAG} ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

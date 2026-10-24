/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONFIG_FILE } from '../../config.mjs';
import { DEFAULT_TARGETS } from '../platforms.constants.mjs';
import { resolvePlatforms } from '../resolve-platforms.mjs';
import { readTargets } from '../targets-source.mjs';

/**
 * @param {string[]} targets ids and bundles
 * @returns {{ server: boolean, windowless: boolean }} windowless: the server is the only platform
 */
const shapeOf = (targets) => {
  const ids = resolvePlatforms(targets).platforms.map((platform) => platform.id);
  return { server: ids.includes('server'), windowless: ids.length > 0 && ids.every((id) => id === 'server') };
};

/**
 * @param {string} rootDir the app folder
 * @returns {{ server: boolean, windowless: boolean }} read from the targets in brock.config.ts
 */
const appShape = (rootDir) => {
  const file = join(rootDir, CONFIG_FILE);
  const targets = (existsSync(file) ? readTargets(readFileSync(file, 'utf8')) : null) ?? DEFAULT_TARGETS;
  return shapeOf(targets);
};

export { appShape, shapeOf };

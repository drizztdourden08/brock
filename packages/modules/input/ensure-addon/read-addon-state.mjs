/* @layer tooling-scripts @kind logic */
import { existsSync, statSync } from 'node:fs';
import { addonStateOf } from './addon-state-of.mjs';
import { newestSourceTime } from './newest-source-time.mjs';
import { readJson } from './read-json.mjs';

/**
 * @param {import('./index.d.mts').AddonPaths} paths
 * @param {import('./index.d.mts').AddonPins} pins
 * @returns {import('./index.d.mts').AddonState}
 */
const readAddonState = (paths, pins) => addonStateOf({
  marker: readJson(paths.markerFile),
  hasBuild: existsSync(paths.nodeFile),
  pins,
  platformArch: paths.platformArch,
  sourcesNewer: () => statSync(paths.nodeFile).mtimeMs < newestSourceTime(paths.nativeDir),
});

export { readAddonState };

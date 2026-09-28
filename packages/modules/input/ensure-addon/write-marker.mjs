/* @layer tooling-scripts @kind logic */
import { mkdirSync, writeFileSync } from 'node:fs';

/**
 * @param {import('./index.d.mts').AddonPaths} paths
 * @param {import('./index.d.mts').AddonPins} pins
 * @param {'prebuilt' | 'local'} source
 * @returns {void}
 */
const writeMarker = (paths, pins, source) => {
  const [platform, arch] = paths.platformArch.split('-');
  const { buildKey, addonVersion, sdl3Version, libusbVersion } = pins;
  const marker = { buildKey, addonVersion, sdl3Version, libusbVersion, platform, arch, source, ensuredAt: new Date().toISOString() };
  mkdirSync(paths.prebuildsDir, { recursive: true });
  writeFileSync(paths.markerFile, `${JSON.stringify(marker, null, 2)}\n`);
};

export { writeMarker };

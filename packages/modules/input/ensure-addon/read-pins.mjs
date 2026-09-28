/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildKeyOf } from './build-key-of.mjs';

/**
 * @param {string} nativeDir
 * @returns {import('./index.d.mts').AddonPins}
 */
const readPins = (nativeDir) => {
  const file = join(nativeDir, 'package.json');
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  if (!pkg.version || !pkg.sdl3 || !pkg.libusb) throw new Error(`${file} must declare "version", "sdl3" and "libusb".`);
  const versions = { addonVersion: pkg.version, sdl3Version: pkg.sdl3, libusbVersion: pkg.libusb };
  return { ...versions, buildKey: buildKeyOf(versions) };
};

export { readPins };

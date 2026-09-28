/* @layer tooling-scripts @kind logic */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ADDON_FILE, RUNTIME_FILE } from './addon.constants.mjs';

/**
 * @param {import('./index.d.mts').AddonPaths} paths
 * @returns {void}
 */
const copyBuiltArtifacts = (paths) => {
  mkdirSync(paths.outDir, { recursive: true });
  const releaseDir = join(paths.addonBuildDir, 'Release');
  const builtDir = existsSync(join(releaseDir, ADDON_FILE)) ? releaseDir : paths.addonBuildDir;
  for (const file of readdirSync(builtDir).filter((name) => RUNTIME_FILE.test(name))) copyFileSync(join(builtDir, file), join(paths.outDir, file));
  const libDir = join(paths.installDir, process.platform === 'win32' ? 'bin' : 'lib');
  if (!existsSync(libDir)) return;
  for (const file of readdirSync(libDir).filter((name) => /libusb/i.test(name) && RUNTIME_FILE.test(name))) copyFileSync(join(libDir, file), join(paths.outDir, file));
};

export { copyBuiltArtifacts };

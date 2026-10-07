/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { halfBuildReason } from '../freshness/half-build-reason.mjs';
import { MAIN_ENTRY } from './testing.constants.mjs';
import { unresolvableImports } from './unresolvable-imports.mjs';

/**
 * @param {string} appDir the app root
 * @returns {string} the main entry, once every import resolves
 */
const assertLaunchable = (appDir) => {
  const main = join(appDir, MAIN_ENTRY);
  if (!existsSync(main)) throw new Error(`${main} does not exist. Run the app's build first.`);
  const half = halfBuildReason(appDir);
  if (half) throw new Error(`The app would open a blank window: ${half}. Run the app's build first.`);
  const missing = unresolvableImports(dirname(main));
  if (missing.length) {
    const lines = missing.map(({ file, spec }) => `  ${relative(appDir, file)} imports ${spec}`).join('\n');
    throw new Error(`The built main imports what Node cannot resolve, so the app would not start:\n${lines}\nDeclare the package in the app's dependencies, or rebuild.`);
  }
  return main;
};

export { assertLaunchable };

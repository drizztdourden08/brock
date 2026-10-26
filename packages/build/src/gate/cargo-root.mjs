/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { CARGO_MANIFEST, CARGO_MANIFEST_ROOT } from './cargo.constants.mjs';
import { repoRootOf } from './clang-format-files.mjs';

const hasManifest = (dir) => {
  const file = join(dir, CARGO_MANIFEST);
  return existsSync(file) && CARGO_MANIFEST_ROOT.test(readFileSync(file, 'utf8'));
};

/**
 * @param {string} appDir the app root, or the repo root of a repo with no app
 * @param {{ gate?: { cargo?: { enabled?: boolean, path?: string } } }} config
 * @returns {string | null} the cargo folder, or null when the lane is off
 */
const cargoRoot = (appDir, config) => {
  const cargo = config.gate?.cargo ?? {};
  if (cargo.enabled === false) return null;
  const root = resolve(repoRootOf(appDir), cargo.path ?? '.');
  if (hasManifest(root)) return root;
  if (cargo.path === undefined) return null;
  throw new Error(`gate.cargo.path: no ${CARGO_MANIFEST} with [workspace] or [package] in ${root}`);
};

export { cargoRoot };

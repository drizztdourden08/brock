/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { resolveModules } from './resolve.mjs';

const forwardSlashes = (path) => path.replace(/\\/g, '/');

/**
 * @param {string} rootDir
 * @param {string[]} ids module ids from brock.config.ts
 * @returns {{ extraResources: { from: string, to: string }[], exclude: string[] }}
 */
const modulePackaging = (rootDir, ids) => {
  const { modules } = resolveModules(rootDir, ids);
  const extraResources = modules.flatMap((m) =>
    (m.manifest.extraResources ?? []).map((resource) => ({ from: forwardSlashes(join(m.dir, resource.from)), to: resource.to })));
  const exclude = modules.flatMap((m) => (m.manifest.packExclude ?? []).map((glob) => `!**/node_modules/${m.packageName}/${glob}`));
  return { extraResources, exclude };
};

export { modulePackaging };

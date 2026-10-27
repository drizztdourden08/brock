/* @layer tooling-scripts @kind logic */
import { realpathSync } from 'node:fs';
import { isAbsolute, join, relative } from 'node:path';
import { SOURCE_SCOPE } from '../vite.constants.mjs';
import { findWorkspaceRoot } from '../workspace.mjs';

const realOf = (dir) => {
  try {
    return realpathSync.native(dir);
  } catch {
    return dir;
  }
};

const holds = (dir, path) => {
  const rel = relative(dir, path);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
};

/**
 * @param {string} rootDir the app root
 * @param {boolean} live true keeps every linked package as served source
 * @param {Set<string>} manifests gets the package.json of each yes
 * @returns {import('./crawl-deps.mjs').BundledTest} yes for Brock linked from outside
 */
const bundledBrockOf = (rootDir, live, manifests) => {
  if (live) return () => false;
  const home = realOf(findWorkspaceRoot(rootDir) ?? rootDir);
  return (name, found) => {
    const bundled = found.linked && name.startsWith(SOURCE_SCOPE) && !holds(home, found.dir);
    if (bundled) manifests.add(join(found.dir, 'package.json'));
    return bundled;
  };
};

export { bundledBrockOf };

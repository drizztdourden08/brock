/* @layer tooling-scripts @kind logic */
import { expandGlob, globBase, workspaceGlobs } from '@drizztdourden08/standards/structure';

/**
 * @param {string} rootDir the repo root
 * @returns {string[]} the folders the workspace globs name, absolute
 */
const workspaceDirs = (rootDir) => {
  const { globs, declared } = workspaceGlobs(rootDir);
  if (!declared) return [];
  const bases = new Set(globs.map(globBase));
  return globs.flatMap((glob) => expandGlob(rootDir, glob, bases));
};

export { workspaceDirs };

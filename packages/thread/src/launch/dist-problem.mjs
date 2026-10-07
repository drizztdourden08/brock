/* @layer tooling-scripts @kind logic */
import { statSync } from 'node:fs';
import { join } from 'node:path';

const DIST_MAIN = join('dist', 'electron', 'main.js');
const DIST_RENDERER = join('dist', 'renderer', 'index.html');
const DIST_OUTPUTS = [DIST_MAIN, join('dist', 'preload', 'preload.mjs'), DIST_RENDERER];

/** @param {string} file */
const changedAt = (file) => statSync(file, { throwIfNoEntry: false })?.mtimeMs ?? null;

/**
 * @param {string} appDir
 * @returns {string | null} why the production build cannot start as it is, or null
 */
const distProblem = (appDir) => {
  const missing = DIST_OUTPUTS.find((output) => changedAt(join(appDir, output)) === null);
  if (missing) return `${missing} is missing`;
  const main = changedAt(join(appDir, DIST_MAIN)) ?? 0;
  const renderer = changedAt(join(appDir, DIST_RENDERER)) ?? 0;
  return renderer < main ? `${DIST_MAIN} is newer than ${DIST_RENDERER}: a dev launch rebuilt main after the last build` : null;
};

export { DIST_MAIN, distProblem };

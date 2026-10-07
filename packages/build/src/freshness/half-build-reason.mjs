/* @layer tooling-scripts @kind logic */
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { DIST_MAIN, DIST_RENDERER } from './freshness.constants.mjs';

/** @param {string} file */
const changedAt = (file) => statSync(file, { throwIfNoEntry: false })?.mtimeMs ?? null;

/**
 * @param {string} appDir
 * @returns {string | null} why dist is a half build, or null
 */
const halfBuildReason = (appDir) => {
  const main = changedAt(join(appDir, DIST_MAIN));
  if (main === null) return null;
  const renderer = changedAt(join(appDir, DIST_RENDERER));
  if (renderer === null) return `${DIST_MAIN} has no built renderer (${DIST_RENDERER} is missing), as a dev launch leaves it`;
  if (renderer < main) return `${DIST_MAIN} is newer than ${DIST_RENDERER}, so a dev launch rebuilt main after the last build`;
  return null;
};

export { halfBuildReason };

/* @layer tooling-scripts @kind logic */
import { mkdirSync, rmSync } from 'node:fs';
import { BASELINE_FLAGS, REVIEW_DATA_SUFFIX } from './review-data.constants.mjs';

const isBaselineArg = (arg) => BASELINE_FLAGS.some((flag) => arg === flag || arg.startsWith(`${flag}=`));

/**
 * @param {string[]} passthrough the flags that reach the app
 * @param {string} userDataDir the launch target's data folder
 * @returns {string} it, or an emptied <dir>-review for a baseline run
 */
const reviewDataDir = (passthrough, userDataDir) => {
  if (!passthrough.includes('--review') && !passthrough.some((arg) => arg.startsWith('--review='))) return userDataDir;
  if (!passthrough.some(isBaselineArg)) return userDataDir;
  const dir = `${userDataDir}${REVIEW_DATA_SUFFIX}`;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  return dir;
};

export { reviewDataDir };

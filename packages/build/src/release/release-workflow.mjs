/* @layer tooling-scripts @kind logic */
import { DEFAULT_TARGETS } from '../platforms/platforms.constants.mjs';
import { composeWorkflows } from './compose-workflows.mjs';

/**
 * @param {string} appDir the app folder, relative to the repo root
 * @param {string[]} [targets] ids and bundles
 * @param {string} [notesDir] the notes folder from the repo root
 * @returns {string} release.yml for a repo whose root is not the app
 */
const releaseWorkflow = (appDir, targets = DEFAULT_TARGETS, notesDir) =>
  composeWorkflows({ targets, appDir: appDir.replace(/\\/g, '/') || '.', prefix: '', notesDir }).release;

export { releaseWorkflow };

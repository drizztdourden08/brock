/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const TEMPLATE = join(import.meta.dirname, 'release-workflow.yml.tmpl');
const RELEASE_WORKFLOW_FILE = '.github/workflows/release.yml';

/**
 * @param {string} appDir the app folder, relative to the repo root
 * @returns {string}
 */
const releaseWorkflow = (appDir) =>
  readFileSync(TEMPLATE, 'utf8').replace(/\r\n/g, '\n').replace('__APP_DIR__', appDir.replace(/\\/g, '/') || '.');

export { releaseWorkflow, RELEASE_WORKFLOW_FILE };

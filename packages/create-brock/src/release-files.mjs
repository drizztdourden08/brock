/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { RELEASE_WORKFLOW_FILE, releaseWorkflow } from '@drizztdourden08/brock-build';

/**
 * @param {string} targetDir
 * @param {string | null} workspaceRoot
 * @returns {string | null} the file written, or null when the repo root owns it
 */
const writeReleaseWorkflow = (targetDir, workspaceRoot) => {
  if (workspaceRoot) return null;
  const file = join(targetDir, RELEASE_WORKFLOW_FILE);
  if (existsSync(file)) return null;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, releaseWorkflow('.'), 'utf8');
  return RELEASE_WORKFLOW_FILE;
};

export { writeReleaseWorkflow };

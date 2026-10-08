/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEFAULT_BRANCH } from './workflows.constants.mjs';

const WORKSPACE_FILE = 'brock.workspace.mjs';
const BASE_FIELD = /\bbase\s*:\s*['"]([^'"\s]+)['"]/;

/**
 * @param {string} repoDir the repo root
 * @returns {string} `base` of brock.workspace.mjs, else main
 */
const defaultBranchOf = (repoDir) => {
  const file = join(repoDir, WORKSPACE_FILE);
  if (!existsSync(file)) return DEFAULT_BRANCH;
  return BASE_FIELD.exec(readFileSync(file, 'utf8'))?.[1] ?? DEFAULT_BRANCH;
};

export { defaultBranchOf };

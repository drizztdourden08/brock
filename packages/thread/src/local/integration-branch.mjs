/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tryGitAt } from '../git.mjs';
import { coordHome } from './coord-home.mjs';

const INTEGRATION_KEY = 'brock-integration';

const ciRootOf = (project) => {
  try {
    return JSON.parse(readFileSync(join(coordHome(), 'remote.json'), 'utf8')).ciRoots?.[project] ?? null;
  } catch {
    return null;
  }
};

const branchAt = (dir) => {
  const name = dir && existsSync(dir) ? tryGitAt(['rev-parse', '--abbrev-ref', 'HEAD'], dir) : null;
  return name && name !== 'HEAD' ? name : null;
};

/**
 * @param {string} branch a release branch
 * @returns {string} the git config key that remembers its integration branch
 */
const integrationKey = (branch) => `branch.${branch}.${INTEGRATION_KEY}`;

/**
 * @param {{ options: Record<string, string | boolean>, project: string, base: string, cwd: string }} input base is the workspace base
 * @returns {string} the integration branch
 */
const integrationBranch = ({ options, project, base, cwd }) => {
  if (typeof options.integration === 'string') return options.integration;
  const here = tryGitAt(['rev-parse', '--abbrev-ref', 'HEAD'], cwd);
  const remembered = here ? tryGitAt(['config', '--get', integrationKey(here)], cwd) : null;
  return remembered ?? branchAt(ciRootOf(project)) ?? base;
};

export { integrationBranch, integrationKey };

/* @layer tooling-scripts @kind logic */
import { normalizePrefix } from './normalize-prefix.mjs';

const ENV_NAME = 'BROCK_WORKTREE_PREFIX';

const fromFlag = (options) => {
  if (options.prefix === undefined) return null;
  if (typeof options.prefix !== 'string') throw new Error('--prefix needs a value: --prefix <text>.');
  return normalizePrefix(options.prefix, '--prefix');
};

const fromEnv = () => (process.env[ENV_NAME] ? normalizePrefix(process.env[ENV_NAME], ENV_NAME) : null);

const fromConfig = (workspace) => (workspace.worktrees?.prefix ? normalizePrefix(workspace.worktrees.prefix, 'brock.workspace.mjs worktrees.prefix') : null);

/**
 * @param {import('../workspace/workspace.type.mjs').Workspace} workspace
 * @param {Record<string, string | boolean>} [options] the verb's options
 * @returns {string} the prefix ending in a dash, or empty
 */
const worktreePrefix = (workspace, options = {}) => fromFlag(options) ?? fromEnv() ?? fromConfig(workspace) ?? '';

export { worktreePrefix };

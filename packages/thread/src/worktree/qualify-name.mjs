/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { worktreePathFor } from './paths.mjs';
import { worktreePrefix } from './worktree-prefix.mjs';

const existsAs = (name, workspace) => existsSync(worktreePathFor(name, workspace));

/**
 * @param {string | undefined} name
 * @param {import('../workspace/workspace.type.mjs').Workspace} workspace
 * @param {Record<string, string | boolean>} [options]
 * @param {{ create?: boolean }} [mode]
 * @returns {string | undefined}
 */
const qualifyName = (name, workspace, options = {}, { create = false } = {}) => {
  const prefix = worktreePrefix(workspace, options);
  if (!prefix || !name || name.startsWith(prefix)) return name;
  const prefixed = `${prefix}${name}`;
  const legacy = !create && !existsAs(prefixed, workspace) && existsAs(name, workspace);
  return legacy ? name : prefixed;
};

export { qualifyName };

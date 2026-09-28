/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { worktreePathFor } from './paths.mjs';

/**
 * @param {string} name
 * @param {import('../workspace/workspace.type.mjs').ThreadContext} ctx
 * @param {Record<string, string | boolean>} [options] the verb's options, for provision steps
 * @returns {import('../workspace/workspace.type.mjs').WorktreeContext}
 */
const createWorktreeContext = (name, ctx, options = {}) => {
  const path = worktreePathFor(name, ctx.workspace);
  return { name, path, main: ctx.rootDir, userData: join(path, '.user-data'), workspace: ctx.workspace, log: ctx.log, options };
};

export { createWorktreeContext };

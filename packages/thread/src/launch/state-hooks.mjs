/* @layer tooling-scripts @kind logic */

/**
 * @callback StatesHook
 * @param {import('../workspace/workspace.type.mjs').WorktreeContext} worktree
 * @param {string} state
 * @returns {string[] | string | null} app flags, a refusal message, or null
 */

const stateFlags = (states, worktree, state) => {
  if (state === 'none') return [];
  if (!states) return [`--state=${state}`];
  const result = states(worktree, state);
  return Array.isArray(result) ? result : [];
};

const checkStateWith = (states) => (worktree, state) => {
  if (state === 'none' || !states) return null;
  const result = states(worktree, state);
  if (Array.isArray(result)) return null;
  return typeof result === 'string' ? result : `"${state}" is not a state "${worktree.name}" knows.`;
};

export { checkStateWith, stateFlags };

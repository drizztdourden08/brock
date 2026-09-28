/* @layer tooling-scripts @kind logic */
import { checkState } from './check-state.mjs';

const flagsFor = (state) => {
  if (state === 'none') return [];
  if (state === 'game') return ['--auto-start'];
  return [`--auto-state=${state}`];
};

/**
 * @param {{ userData: string, name: string, workspace?: object }} worktree
 * @param {string} state
 * @returns {string[] | string} the app flags, or the refusal when the state does not exist
 */
const saveStateOf = (worktree, state) => checkState(worktree, state) ?? flagsFor(state);

export { saveStateOf };

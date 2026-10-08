/* @layer tooling-scripts @kind logic */
import { snesOptions } from '../snes-options.mjs';
import { checkState } from './check-state.mjs';

const flagsFor = (worktree, state) => {
  if (state === 'none') return [];
  const { launchFlags } = snesOptions('states', worktree.workspace);
  if (state === 'game') return [...launchFlags.game];
  return launchFlags.save.map((flag) => flag.replaceAll('{state}', state));
};

/**
 * @param {{ userData: string, name: string, workspace?: object }} worktree
 * @param {string} state
 * @returns {string[] | string} the app flags, or the refusal when the state does not exist
 */
const saveStateOf = (worktree, state) => checkState(worktree, state) ?? flagsFor(worktree, state);

export { saveStateOf };

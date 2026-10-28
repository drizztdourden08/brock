/* @layer renderer-shell @kind logic */
import { heldState } from './held-state';

const clearModifiers = (): void => {
  heldState.modifiers = [];
};

export { clearModifiers };

/* @layer renderer-shell @kind logic */
import { heldState } from './held-state';
import type { ModifierFlags } from './modifier-flags.type';
import { modifiersOf } from './modifiers-of';

const trackModifiers = (flags: ModifierFlags): void => {
  heldState.modifiers = modifiersOf(flags);
};

export { trackModifiers };

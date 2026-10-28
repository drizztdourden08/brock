/* @layer renderer-shell @kind logic */
import type { HeldModifier } from './command.type';
import { heldState } from './held-state';
import type { ModifierFlags } from './modifier-flags.type';
import { modifiersOf } from './modifiers-of';

const currentModifiers = (flags?: ModifierFlags): HeldModifier[] => (flags === undefined ? [...heldState.modifiers] : modifiersOf(flags));

export { currentModifiers };

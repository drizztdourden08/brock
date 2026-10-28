/* @layer renderer-shell @kind logic */
import type { HeldModifier } from './command.type';

const heldState: { modifiers: HeldModifier[] } = { modifiers: [] };

export { heldState };

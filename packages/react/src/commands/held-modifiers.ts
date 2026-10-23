/* @layer renderer-shell @kind logic */
import { MODIFIER_ORDER } from './commands.constants';
import type { HeldModifier, ParsedChord } from './command.type';

const heldModifiers = (parsed: ParsedChord): HeldModifier[] => MODIFIER_ORDER.filter((name) => parsed[name]);

export { heldModifiers };

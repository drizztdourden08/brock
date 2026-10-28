/* @layer renderer-shell @kind logic */
import { MODIFIER_ORDER } from './commands.constants';
import type { HeldModifier } from './command.type';
import type { ModifierFlags } from './modifier-flags.type';

const modifiersOf = (flags: ModifierFlags): HeldModifier[] => MODIFIER_ORDER.filter((name) => flags[`${name}Key`]);

export { modifiersOf };

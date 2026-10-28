/* @layer renderer-shell @kind logic */
import { activeHolds } from './active-holds';
import type { CommandContext, CommandDef, ParsedChord } from './command.type';
import { eventKeys } from './event-keys';

const startHold = (def: CommandDef, context: CommandContext, chord: ParsedChord, event: KeyboardEvent): void => {
  activeHolds.set(def.id, { def, context, chord, keys: eventKeys(event), since: Date.now() });
};

export { startHold };

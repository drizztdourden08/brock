/* @layer renderer-shell @kind logic */
import { GATED_REASON } from './commands.constants';
import type { CommandBlock, CommandDef } from './command.type';

const commandBlock = (def: CommandDef): CommandBlock | null => {
  if (def.when?.() === false) return { why: 'gated', reason: def.reason?.() ?? GATED_REASON };
  const reason = def.reason?.() ?? null;
  return reason === null ? null : { why: 'disabled', reason };
};

export { commandBlock };

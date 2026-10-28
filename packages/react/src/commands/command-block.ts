/* @layer renderer-shell @kind logic */
import { blockReason } from './block-reason';
import { commandVisible } from './command-visible';
import { GATED_REASON, HIDDEN_REASON } from './commands.constants';
import type { CommandBlock, CommandDef } from './command.type';

const commandBlock = (def: CommandDef): CommandBlock | null => {
  if (!commandVisible(def)) return { why: 'hidden', reason: blockReason(def, HIDDEN_REASON) };
  if (def.when?.() === false) return { why: 'gated', reason: blockReason(def, GATED_REASON) };
  const reason = def.reason?.() ?? null;
  return reason === null ? null : { why: 'disabled', reason };
};

export { commandBlock };

/* @layer renderer-shell @kind logic */
import type { CommandContext, CommandDef } from './command.type';

const tapHold = (def: CommandDef, context: CommandContext | undefined): void => {
  def.hold?.release({ point: { x: 0, y: 0 }, target: null, trigger: 'assistant', data: undefined, ...context, heldMs: 0, tap: true, cause: 'run' });
};

export { tapHold };

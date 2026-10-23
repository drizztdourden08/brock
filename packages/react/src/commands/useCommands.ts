/* @layer renderer-shell @kind hook */
import { COMMAND_RANKS } from './commands.constants';
import type { CommandDef } from './command.type';
import { useCommandSource } from './useCommandSource';

const useCommands = (defs: readonly CommandDef[]): void => useCommandSource(COMMAND_RANKS.runtime, defs);

export { useCommands };

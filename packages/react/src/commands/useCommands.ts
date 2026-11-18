/* @layer renderer-shell @kind hook */
import { COMMAND_RANKS } from './commands.constants';
import type { CommandInput } from './command.type';
import { useCommandSource } from './useCommandSource';

const useCommands = (defs: readonly CommandInput[]): void => useCommandSource(COMMAND_RANKS.runtime, defs);

export { useCommands };

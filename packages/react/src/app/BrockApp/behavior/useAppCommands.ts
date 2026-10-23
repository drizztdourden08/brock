/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { COMMAND_RANKS, NO_COMMANDS } from '../../../commands/commands.constants';
import type { CommandDef } from '../../../commands/command.type';
import { useCommandSource } from '../../../commands/useCommandSource';

const useAppCommands = (moduleCommands: readonly CommandDef[], appCommands: readonly CommandDef[] = NO_COMMANDS): void => {
  const all = useMemo(() => [...moduleCommands, ...appCommands], [moduleCommands, appCommands]);
  useCommandSource(COMMAND_RANKS.app, all);
};

export { useAppCommands };

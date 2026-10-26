/* @layer renderer-shell @kind hook */
import { COMMAND_RANKS } from '../commands/commands.constants';
import { useCommandSource } from '../commands/useCommandSource';
import { toolbarCommands } from './toolbar-commands';

const useToolbarCommands = (): void => {
  useCommandSource(COMMAND_RANKS.brock, toolbarCommands);
};

export { useToolbarCommands };

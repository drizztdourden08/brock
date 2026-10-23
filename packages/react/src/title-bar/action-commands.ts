/* @layer renderer-shell @kind logic */
import { STANDARD_ACTION_COMMANDS } from './title-bar.constants';

const links = new Map<string, string>(Object.entries(STANDARD_ACTION_COMMANDS));

const actionCommands = {
  link: (actionId: string, commandId: string): void => { links.set(actionId, commandId); },
  of: (actionId: string): string | undefined => links.get(actionId),
};

export { actionCommands };

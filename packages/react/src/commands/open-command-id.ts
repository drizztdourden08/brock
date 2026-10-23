/* @layer renderer-shell @kind logic */
import { OPEN_COMMAND_PREFIX } from './commands.constants';

const openCommandId = (route: string): string => `${OPEN_COMMAND_PREFIX}${route}`;

export { openCommandId };

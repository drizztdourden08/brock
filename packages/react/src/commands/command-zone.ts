/* @layer renderer-shell @kind logic */
import { COMMAND_ZONE_ATTRIBUTE } from './commands.constants';

const commandZone = (zone: string): Record<typeof COMMAND_ZONE_ATTRIBUTE, string> => ({ [COMMAND_ZONE_ATTRIBUTE]: zone });

export { commandZone };

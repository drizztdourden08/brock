/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { commandText } from './command-text';
import type { CommandDef } from './command.type';

const blockReason = (def: CommandDef, fallback: Text): string => def.reason?.() ?? commandText(fallback);

export { blockReason };

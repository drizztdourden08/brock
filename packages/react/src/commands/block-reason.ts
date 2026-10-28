/* @layer renderer-shell @kind logic */
import type { CommandDef } from './command.type';

const blockReason = (def: CommandDef, fallback: string): string => def.reason?.() ?? fallback;

export { blockReason };

/* @layer renderer-shell @kind logic */
import type { CommandDef } from './command.type';

const defineCommand = (def: CommandDef): CommandDef => def;

export { defineCommand };

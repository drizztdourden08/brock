/* @layer renderer-shell @kind logic */
import type { CommandInput } from './command.type';

const defineCommand = <T extends CommandInput>(def: T): T => def;

export { defineCommand };

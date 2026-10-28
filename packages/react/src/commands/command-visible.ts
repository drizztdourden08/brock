/* @layer renderer-shell @kind logic */
import type { CommandDef } from './command.type';

const commandVisible = (def: Pick<CommandDef, 'visible'>): boolean => def.visible?.() !== false;

export { commandVisible };

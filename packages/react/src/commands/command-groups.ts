/* @layer renderer-shell @kind logic */
import { commandVisible } from './command-visible';
import { COMMANDS_GROUP, GENERAL_GROUP, SCREENS_GROUP } from './commands.constants';
import type { CommandDef, CommandGroup } from './command.type';

const groupOf = (def: CommandDef): string => def.group ?? COMMANDS_GROUP;

const commandGroups = (defs: readonly CommandDef[]): CommandGroup[] => {
  const shown = defs.filter((def) => def.when?.() !== false && (commandVisible(def) || def.only !== undefined));
  const middle = shown.map(groupOf).filter((title) => title !== GENERAL_GROUP && title !== SCREENS_GROUP);
  const titles = [...new Set([GENERAL_GROUP, ...middle, SCREENS_GROUP])];
  return titles
    .map((title) => ({ title, commands: shown.filter((def) => groupOf(def) === title) }))
    .filter((group) => group.commands.length > 0);
};

export { commandGroups };

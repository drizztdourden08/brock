/* @layer renderer-shell @kind logic */
import type { CommandContext, CommandDef } from '../commands/command.type';
import { commands } from '../commands/commands';
import { palette } from './palette';
import type { GivenArgs } from './run-with-picker.type';

const pending = (def: CommandDef, given: GivenArgs): [string, NonNullable<CommandDef['args']>[string]] | undefined =>
  Object.entries(def.args ?? {}).find(([name, field]) => field.optional !== true && field.options !== undefined && given[name] === undefined);

const contextOf = (args: GivenArgs): CommandContext => ({ point: { x: 0, y: 0 }, target: null, trigger: 'pointer', data: undefined, args });

const runWithPicker = async (id: string, given: GivenArgs = {}): Promise<void> => {
  const def = commands.list({ includeHidden: true }).find((each) => each.id === id);
  const next = def === undefined ? undefined : pending(def, given);
  if (def === undefined || next === undefined) {
    await commands.run(id, def?.args === undefined ? undefined : contextOf(given));
    return;
  }
  const [name, field] = next;
  palette.pick({
    title: field.label ?? def.label,
    options: field.options ?? [],
    onPick: (value) => { void runWithPicker(id, { ...given, [name]: value }); },
  });
};

export { runWithPicker };

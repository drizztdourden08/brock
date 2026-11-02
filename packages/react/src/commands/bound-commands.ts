/* @layer renderer-shell @kind logic */
import type { KeymapOverrides } from '@drizztdourden08/brock-core';
import { bindingKey } from './binding-key';
import { parseBindingKey } from './parse-binding-key';
import type { Wanted } from './bound-commands.type';
import type { BoundArgs, CommandContext, CommandDef } from './command.type';

const argsLabel = (base: CommandDef, args: BoundArgs['args']): string =>
  Object.entries(args).map(([name, value]) => base.args?.[name]?.options?.find((option) => option.value === value)?.label ?? String(value)).join(', ');

const withArgs = (context: CommandContext | undefined, args: BoundArgs['args']): CommandContext =>
  ({ point: { x: 0, y: 0 }, target: null, trigger: 'keyboard', data: undefined, ...context, args });

const boundOf = (key: string, { base, bound, chord }: Wanted): CommandDef => {
  const { chord: _chord, args: _schema, bindings: _bindings, hold, ...rest } = base;
  return {
    ...rest,
    id: key,
    label: `${base.label}: ${argsLabel(base, bound.args)}`,
    bound,
    ...(chord === undefined ? {} : { chord }),
    run: (context) => base.run(withArgs(context, bound.args)),
    ...(hold === undefined ? {} : { hold: { ...hold, release: (context) => hold.release({ ...context, args: bound.args }) } }),
  };
};

const declared = (defs: readonly CommandDef[]): [string, Wanted][] =>
  defs.filter((base) => base.args !== undefined).flatMap((base) =>
    (base.bindings ?? []).map((each): [string, Wanted] => [bindingKey(base.id, each.args), { base, bound: { id: base.id, args: each.args }, chord: each.chord }]));

const saved = (defs: readonly CommandDef[], overrides: KeymapOverrides): [string, Wanted][] =>
  Object.keys(overrides).flatMap((key): [string, Wanted][] => {
    const bound = parseBindingKey(key);
    const base = bound === null ? undefined : defs.find((def) => def.id === bound.id && def.args !== undefined);
    return bound === null || base === undefined ? [] : [[key, { base, bound }]];
  });

const boundCommands = (defs: readonly CommandDef[], overrides: KeymapOverrides): CommandDef[] =>
  [...new Map([...saved(defs, overrides), ...declared(defs)]).entries()].map(([key, wanted]) => boundOf(key, wanted));

export { boundCommands };

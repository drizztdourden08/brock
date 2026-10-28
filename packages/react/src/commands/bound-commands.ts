/* @layer renderer-shell @kind logic */
import type { KeymapOverrides } from '@drizztdourden08/brock-core';
import { parseBindingKey } from './parse-binding-key';
import type { BoundArgs, CommandContext, CommandDef } from './command.type';

const argsLabel = (base: CommandDef, args: BoundArgs['args']): string =>
  Object.entries(args).map(([name, value]) => base.args?.[name]?.options?.find((option) => option.value === value)?.label ?? String(value)).join(', ');

const withArgs = (context: CommandContext | undefined, args: BoundArgs['args']): CommandContext =>
  ({ point: { x: 0, y: 0 }, target: null, trigger: 'keyboard', data: undefined, ...context, args });

const boundOf = (base: CommandDef, key: string, bound: BoundArgs): CommandDef => {
  const { chord: _chord, args: _schema, hold, ...rest } = base;
  return {
    ...rest,
    id: key,
    label: `${base.label}: ${argsLabel(base, bound.args)}`,
    bound,
    run: (context) => base.run(withArgs(context, bound.args)),
    ...(hold === undefined ? {} : { hold: { ...hold, release: (context) => hold.release({ ...context, args: bound.args }) } }),
  };
};

const boundCommands = (defs: readonly CommandDef[], overrides: KeymapOverrides): CommandDef[] =>
  Object.keys(overrides).flatMap((key) => {
    const bound = parseBindingKey(key);
    const base = bound === null ? undefined : defs.find((def) => def.id === bound.id && def.args !== undefined);
    return bound === null || base === undefined ? [] : [boundOf(base, key, bound)];
  });

export { boundCommands };

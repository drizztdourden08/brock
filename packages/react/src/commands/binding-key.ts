/* @layer renderer-shell @kind logic */
import type { ArgValue } from './command.type';
import { BIND_SEPARATOR } from './commands.constants';

const sorted = (args: Readonly<Record<string, ArgValue>>): Record<string, ArgValue> =>
  Object.fromEntries(Object.entries(args).sort(([a], [b]) => (a < b ? -1 : 1)));

const bindingKey = (id: string, args: Readonly<Record<string, ArgValue>>): string => `${id}${BIND_SEPARATOR}${JSON.stringify(sorted(args))}`;

export { bindingKey };

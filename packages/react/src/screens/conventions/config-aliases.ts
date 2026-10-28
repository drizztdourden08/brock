/* @layer renderer-shell @kind logic */
import type { RouteAlias } from '../../navigation/navigation.type';

const configAliases = (aliases: Readonly<Record<string, string>> | undefined): Record<string, RouteAlias> =>
  Object.fromEntries(Object.entries(aliases ?? {}).map(([name, target]): [string, RouteAlias] => [name, (params) => ({ active: target, params })]));

export { configAliases };

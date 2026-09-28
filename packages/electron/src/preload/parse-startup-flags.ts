/* @layer electron-main @kind logic */
import { PREFIX } from './startup-info.constants';

const parseStartupFlags = (argv: readonly string[]): Record<string, string | true> => {
  const flags: Record<string, string | true> = {};
  for (const arg of argv) {
    if (!arg.startsWith(PREFIX)) continue;
    const body = arg.slice(PREFIX.length);
    const eq = body.indexOf('=');
    if (eq === -1) flags[body] = true;
    else flags[body.slice(0, eq)] = body.slice(eq + 1);
  }
  return flags;
};

export { parseStartupFlags };

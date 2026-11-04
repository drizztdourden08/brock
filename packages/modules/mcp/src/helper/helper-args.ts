/* @layer mcp-helper @kind logic */
import { BRIDGE_FILE_ENV } from '@drizztdourden08/brock-electron/bridge';
import { HELPER_ARG } from './helper.constants';
import type { HelperArgs } from './helper.type';

const valueOf = (argv: readonly string[], prefix: string): string | null => {
  let found: string | null = null;
  for (const arg of argv) {
    if (arg.startsWith(prefix)) found = arg.slice(prefix.length).trim() || null;
  }
  return found;
};

const parseHelperArgs = (argv: readonly string[], env: Readonly<Record<string, string | undefined>>): HelperArgs => ({
  userData: valueOf(argv, HELPER_ARG.userData),
  instance: valueOf(argv, HELPER_ARG.instance),
  file: valueOf(argv, HELPER_ARG.file) ?? (env[BRIDGE_FILE_ENV]?.trim() || null),
});

export { parseHelperArgs };

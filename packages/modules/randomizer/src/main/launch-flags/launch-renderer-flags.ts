/* @layer electron-main @kind logic */
import { LAUNCH_FLAG_NAMES, STARTUP_PREFIX } from '../../archipelago/launch-flags';

const valueOf = (argv: readonly string[], name: string): string | null => {
  const head = `--${name}=`;
  const found = argv.find((arg) => arg.startsWith(head));
  const value = found === undefined ? '' : found.slice(head.length);
  return value === '' ? null : value;
};

const launchRendererFlags = (argv: readonly string[]): string[] =>
  LAUNCH_FLAG_NAMES.flatMap((name) => {
    const value = valueOf(argv, name);
    return value === null ? [] : [`${STARTUP_PREFIX}${name}=${value}`];
  });

export { launchRendererFlags };

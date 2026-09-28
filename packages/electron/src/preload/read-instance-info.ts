/* @layer electron-main @kind logic */
import type { InstanceInfo } from '@drizztdourden08/brock-core/ipc';
import { parseStartupFlags } from './parse-startup-flags';

const text = (value: string | true | undefined): string | null => (typeof value === 'string' && value ? value : null);

const readInstanceInfo = (argv: readonly string[] = process.argv): InstanceInfo => {
  const flags = parseStartupFlags(argv);
  return { name: text(flags.instance), profile: text(flags.profile) };
};

export { readInstanceInfo };

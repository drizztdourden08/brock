/* @layer electron-main @kind logic */
import type { StartupInfo } from '@drizztdourden08/brock-core/ipc';
import { parseStartupFlags } from './parse-startup-flags';

const readStartupInfo = (argv: readonly string[] = process.argv): StartupInfo => {
  const flags = parseStartupFlags(argv);
  return {
    fresh: flags.fresh === true,
    automation: flags.automation === true,
    muted: flags.muted === true,
    sound: flags.sound === true,
    flags,
  };
};

export { readStartupInfo };

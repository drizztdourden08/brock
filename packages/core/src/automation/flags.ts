/* @layer core @kind logic */
import type { AutomationFlags } from './flags.type';
import { BACKGROUND_FLAG, BASE_AUTOMATION_FLAGS, IDENTITY_FLAGS } from './flags.constants';

const matches = (arg: string, flag: string): boolean => arg === flag || arg.startsWith(`${flag}=`);

const createAutomationFlags = (extra: readonly string[] = []): AutomationFlags => {
  const flags = [...new Set([...BASE_AUTOMATION_FLAGS, ...extra])];
  const headless = flags.filter((f) => !IDENTITY_FLAGS.includes(f));
  const argvOf = (argv?: readonly string[]): readonly string[] => argv ?? (typeof process !== 'undefined' ? process.argv : []);
  const isAutomationLaunch = (argv?: readonly string[]): boolean => argvOf(argv).some((arg) => flags.some((f) => matches(arg, f)));
  return {
    flags,
    isAutomationLaunch,
    isBackgroundLaunch: (argv) => {
      const args = argvOf(argv);
      return !args.some((arg) => headless.some((f) => matches(arg, f))) && args.some((arg) => matches(arg, BACKGROUND_FLAG));
    },
    isHeadlessLaunch: (argv) => {
      const args = argvOf(argv);
      if (args.includes('--visible')) return false;
      return args.some((arg) => headless.some((f) => matches(arg, f)));
    },
    flagValue: (flag, argv) => {
      const prefix = `${flag}=`;
      const raw = argvOf(argv).find((arg) => arg.startsWith(prefix))?.slice(prefix.length).trim();
      if (!raw) return null;
      return raw;
    },
    hasFlag: (flag, argv) => argvOf(argv).some((arg) => matches(arg, flag)),
  };
};

export { createAutomationFlags };

/* @layer core @kind logic */
import type { AutomationFlags } from './flags.type';
import { BASE_AUTOMATION_FLAGS, IDENTITY_FLAGS } from './flags.constants';

const matches = (arg: string, flag: string): boolean => arg === flag || arg.startsWith(`${flag}=`);

const createAutomationFlags = (extra: readonly string[] = []): AutomationFlags => {
  const flags = [...new Set([...BASE_AUTOMATION_FLAGS, ...extra])];
  const headless = flags.filter((f) => !IDENTITY_FLAGS.includes(f));
  const argvOf = (argv?: readonly string[]): readonly string[] => argv ?? (typeof process !== 'undefined' ? process.argv : []);
  return {
    flags,
    isAutomationLaunch: (argv) => argvOf(argv).some((arg) => flags.some((f) => matches(arg, f))),
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

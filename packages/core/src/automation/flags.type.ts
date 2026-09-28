/* @layer core @kind types */
interface AutomationFlags {
  flags: readonly string[];
  isAutomationLaunch: (argv?: readonly string[]) => boolean;
  isHeadlessLaunch: (argv?: readonly string[]) => boolean;
  flagValue: (flag: string, argv?: readonly string[]) => string | null;
  hasFlag: (flag: string, argv?: readonly string[]) => boolean;
}

export type { AutomationFlags };

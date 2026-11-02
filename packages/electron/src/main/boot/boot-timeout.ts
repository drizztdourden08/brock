/* @layer electron-main @kind logic */
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';
import { DEFAULT_BOOT_TIMEOUT_MS } from '@drizztdourden08/brock-core/boot';
import { secondsFlagMs } from '../bootstrap/seconds-flag-ms';
import { AUTOMATED_BOOT_TIMEOUT_MS, BOOT_TIMEOUT_FLAG } from './boot-timeout.constants';

const bootTimeout = (flags: AutomationFlags, argv?: readonly string[]): { ms: number; problem: string | null } => {
  const automated = flags.isAutomationLaunch(argv) || flags.isHeadlessLaunch(argv);
  const fallbackMs = automated ? AUTOMATED_BOOT_TIMEOUT_MS : DEFAULT_BOOT_TIMEOUT_MS;
  return secondsFlagMs(BOOT_TIMEOUT_FLAG, flags.flagValue(BOOT_TIMEOUT_FLAG, argv), fallbackMs);
};

export { bootTimeout };

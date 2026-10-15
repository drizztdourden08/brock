/* @layer electron-main @kind logic */
import type { ProductBoot } from '@drizztdourden08/brock-core/product';
import { DEV_WATCHDOG_MS, WATCHDOG_ENV, WATCHDOG_MS } from './reveal.constants';

const fromEnv = (value: string | undefined): number | null => {
  if (value === undefined || !/^\d+$/.test(value.trim())) return null;
  const ms = Number(value);
  return ms > 0 ? ms : null;
};

const watchdogMsOf = (isDev: boolean, boot: ProductBoot | undefined, env: NodeJS.ProcessEnv = process.env): number =>
  fromEnv(env[WATCHDOG_ENV]) ?? (isDev ? boot?.devWatchdogMs ?? DEV_WATCHDOG_MS : boot?.watchdogMs ?? WATCHDOG_MS);

export { watchdogMsOf };

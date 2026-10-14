/* @layer renderer-shell @kind logic */
import type { CoreCrash, CrashWatch, GameCoreOptions } from './game-core.type';
import { watchCoreCrash } from './watch-core-crash';

const createCrashWatch = (options: GameCoreOptions, fail: (message: string) => void): CrashWatch => {
  let unwatch: (() => void) | null = null;
  const report = (crash: CoreCrash): void => {
    fail(crash.message);
    options.onCrash?.(crash);
  };
  return {
    arm: () => { unwatch ??= watchCoreCrash(report, options.crashArmDelayMs); },
    disarm: () => {
      unwatch?.();
      unwatch = null;
    },
  };
};

export { createCrashWatch };

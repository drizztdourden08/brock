/* @layer renderer-shell @kind types */
import type { BeforeQuit, OnBeforeQuit } from '../../../quit/quit.type';

interface QuitGuardSources {
  moduleSync: readonly BeforeQuit[];
  moduleAsync: readonly OnBeforeQuit[];
  sync: BeforeQuit | undefined;
  async: OnBeforeQuit | undefined;
}

export type { QuitGuardSources };

/* @layer electron-main @kind logic */
import { bootState } from './boot-state';
import { crossfade } from './crossfade';

const settleHolds = async (): Promise<void> => {
  let seen = -1;
  while (seen !== bootState.holds.length) {
    seen = bootState.holds.length;
    await Promise.all(bootState.holds);
  }
};

const tryReveal = (): void => {
  const { app: win } = bootState;
  if (bootState.revealing || bootState.revealed || bootState.failure || !bootState.mainDone || !bootState.rendererReady) return;
  if (!win || win.isDestroyed()) return;
  bootState.revealing = true;
  bootState.timeline.bootDoneAt = Date.now();
  if (bootState.watchdog) clearTimeout(bootState.watchdog);
  bootState.watchdog = null;
  void settleHolds().then(() => crossfade(win));
};

export { tryReveal };

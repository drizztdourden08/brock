/* @layer electron-main @kind logic */
import { bootState } from './boot-state';
import { crossfade } from './crossfade';

const tryReveal = (): void => {
  const { app: win } = bootState;
  if (bootState.revealing || bootState.revealed || bootState.failure || !bootState.mainDone || !bootState.rendererReady) return;
  if (!win || win.isDestroyed()) return;
  bootState.revealing = true;
  bootState.timeline.bootDoneAt = Date.now();
  if (bootState.watchdog) clearTimeout(bootState.watchdog);
  bootState.watchdog = null;
  void Promise.all(bootState.holds).then(() => crossfade(win));
};

export { tryReveal };

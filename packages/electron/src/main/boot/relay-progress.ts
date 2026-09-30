/* @layer electron-main @kind logic */
import { SPLASH_CHANNELS } from '../../splash-preload/splash-channels.constants';
import { bootState } from './boot-state';
import { combineBootProgress } from './combine-boot-progress';
import { sendToSplash } from './send-to-splash';

const relayProgress = (): void => {
  if (bootState.failure) return;
  const view = combineBootProgress(bootState.main, bootState.renderer, bootState.lastSide);
  bootState.shownFraction = Math.max(bootState.shownFraction, view.fraction);
  sendToSplash(SPLASH_CHANNELS.progress, { ...view, fraction: bootState.shownFraction });
};

export { relayProgress };

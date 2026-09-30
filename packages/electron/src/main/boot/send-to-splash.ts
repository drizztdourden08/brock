/* @layer electron-main @kind logic */
import type { SplashFailureView, SplashProgressView } from '../../splash-preload/splash-bridge.type';
import type { SPLASH_CHANNELS } from '../../splash-preload/splash-channels.constants';
import { bootState } from './boot-state';

const sendToSplash = (channel: typeof SPLASH_CHANNELS.progress | typeof SPLASH_CHANNELS.failure, view: SplashProgressView | SplashFailureView): void => {
  const splash = bootState.splash;
  if (!splash || splash.isDestroyed() || splash.webContents.isLoading()) return;
  splash.webContents.send(channel, view);
};

export { sendToSplash };

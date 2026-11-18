/* @layer electron-main @kind logic */
import type { SplashFailureView, SplashProgressView, SplashTexts } from '../../splash-preload/splash-bridge.type';
import type { SPLASH_CHANNELS } from '../../splash-preload/splash-channels.constants';
import { bootState } from './boot-state';

type SplashChannel = typeof SPLASH_CHANNELS.progress | typeof SPLASH_CHANNELS.failure | typeof SPLASH_CHANNELS.text;

const sendToSplash = (channel: SplashChannel, view: SplashProgressView | SplashFailureView | SplashTexts): void => {
  const splash = bootState.splash;
  if (!splash || splash.isDestroyed() || splash.webContents.isLoading()) return;
  splash.webContents.send(channel, view);
};

export { sendToSplash };

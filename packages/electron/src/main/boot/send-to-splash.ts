/* @layer electron-main @kind logic */
import type { SplashFailureView, SplashProgressView, SplashTexts } from '../../splash-preload/splash-bridge.type';
import type { SplashChannel } from './send-to-splash.type';
import { bootState } from './boot-state';

const sendToSplash = (channel: SplashChannel, view: SplashProgressView | SplashFailureView | SplashTexts): void => {
  const splash = bootState.splash;
  if (!splash || splash.isDestroyed() || splash.webContents.isLoading()) return;
  splash.webContents.send(channel, view);
};

export { sendToSplash };

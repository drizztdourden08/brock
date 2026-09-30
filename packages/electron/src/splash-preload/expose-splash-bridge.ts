/* @layer electron-main @kind logic */
import { contextBridge, ipcRenderer } from 'electron';
import type { SplashBridge, SplashFailureView, SplashProgressView } from './splash-bridge.type';
import { SPLASH_CHANNELS, SPLASH_GLOBAL } from './splash-channels.constants';

const exposeSplashBridge = (): void => {
  const bridge: SplashBridge = {
    onProgress: (listener) => { ipcRenderer.on(SPLASH_CHANNELS.progress, (_event, view: SplashProgressView) => listener(view)); },
    onFailure: (listener) => { ipcRenderer.on(SPLASH_CHANNELS.failure, (_event, view: SplashFailureView) => listener(view)); },
    retry: () => ipcRenderer.send(SPLASH_CHANNELS.retry),
    quit: () => ipcRenderer.send(SPLASH_CHANNELS.quit),
    openLogs: () => ipcRenderer.send(SPLASH_CHANNELS.openLogs),
  };
  contextBridge.exposeInMainWorld(SPLASH_GLOBAL, bridge);
};

export { exposeSplashBridge };

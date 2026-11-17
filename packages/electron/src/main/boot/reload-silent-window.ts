/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { devServerUrl } from '../window/dev-server-url';
import { bootState } from './boot-state';
import { SILENT_RELOAD_MS } from './reveal.constants';

const isSilent = (win: BrowserWindow): boolean => !win.isDestroyed() && bootState.app === win && !bootState.renderer && !bootState.rendererReady && !bootState.failure && !bootState.revealed;

const reloadSilentWindow = (win: BrowserWindow): void => {
  if (!devServerUrl()) return;
  setTimeout(() => {
    if (isSilent(win)) win.webContents.reload();
  }, SILENT_RELOAD_MS);
};

export { reloadSilentWindow };

/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { DisplayMain } from './display-main.type';

const watchWindow = (win: BrowserWindow, ctx: MainContext, display: DisplayMain): void => {
  const fullscreen = (isFullscreen: boolean): void => {
    display.windowMode.onFullscreenChange(isFullscreen);
    display.syncedRate.onFullscreenChange(isFullscreen);
    ctx.emit('display:changed');
  };
  win.on('enter-full-screen', () => { fullscreen(true); });
  win.on('leave-full-screen', () => { fullscreen(false); });
  win.on('moved', () => { ctx.emit('display:changed'); });
  win.on('closed', () => { display.syncedRate.restore(); });
};

export { watchWindow };

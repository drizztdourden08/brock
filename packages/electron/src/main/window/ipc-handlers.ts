/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { HandlerGroup } from '../types/main-context.type';
import { mainClusterControl } from '../widgets/main-cluster-control';
import { widgetWindowControl } from '../widgets/widget-window-control';
import { emit } from '../ipc/emit';
import { bootState } from '../boot/boot-state';
import { headlessFullscreen } from './headless-fullscreen';
import { setPinned } from './set-pinned';

const isFullscreen = (win: BrowserWindow | null | undefined): boolean => (win ? win.isFullScreen() || headlessFullscreen.is(win) : false);

const windowHandlers: HandlerGroup = {
  id: 'window',
  register: ({ handle, on, window }) => {
    on('window:minimize', () => {
      if (!mainClusterControl.minimize()) window()?.minimize();
    });
    on('window:maximize', () => {
      const win = window();
      if (!win?.isMaximizable() || mainClusterControl.maximize()) return;
      if (win.isMaximized()) win.unmaximize();
      else win.maximize();
    });
    on('window:close', () => window()?.close());
    on('window:openDevTools', () => {
      if (!bootState.headless) window()?.webContents.openDevTools();
    });
    on('window:toggleFullscreen', () => {
      const win = window();
      if (!win?.isFullScreenable() || mainClusterControl.fullscreen()) return;
      if (headlessFullscreen.applies()) headlessFullscreen.set(win, !headlessFullscreen.is(win), (on) => emit(win, 'window:fullscreen', on));
      else win.setFullScreen(!win.isFullScreen());
    });
    on('window:setFullscreen', (_e, value) => {
      const win = window();
      if (!win?.isFullScreenable() || mainClusterControl.fullscreen(value)) return;
      if (headlessFullscreen.applies()) headlessFullscreen.set(win, value, (on) => emit(win, 'window:fullscreen', on));
      else win.setFullScreen(value);
    });

    handle('window:isMaximized', () => mainClusterControl.isMaximized() ?? window()?.isMaximized() ?? false);
    handle('window:setAudioMuted', (_event, muted) => {
      const contents = window()?.webContents;
      contents?.setAudioMuted(muted);
      return contents?.isAudioMuted() ?? false;
    });
    handle('window:isAudioMuted', () => window()?.webContents.isAudioMuted() ?? false);
    handle('window:isFullscreen', () => mainClusterControl.isFullscreen() ?? isFullscreen(window()));
    handle('window:setAlwaysOnTop', (_event, value) => {
      const win = window();
      if (win) setPinned(win, value);
      const onTop = win?.isAlwaysOnTop() ?? false;
      widgetWindowControl.mirrorMainPin(onTop);
      return onTop;
    });
  },
};

export { windowHandlers };

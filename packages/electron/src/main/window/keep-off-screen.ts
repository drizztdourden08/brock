/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';

const keepOffScreen = (win: BrowserWindow): BrowserWindow => {
  const state = { shown: false, minimized: false, maximized: false, fullscreen: false };

  const reveal = (): void => {
    if (state.shown) return;
    state.shown = true;
    win.emit('show');
  };

  Object.assign(win, {
    show: reveal,
    showInactive: reveal,
    hide: (): void => {
      if (!state.shown) return;
      state.shown = false;
      win.emit('hide');
    },
    isVisible: (): boolean => state.shown && !state.minimized,
    minimize: (): void => {
      if (state.minimized) return;
      state.minimized = true;
      win.emit('minimize');
    },
    restore: (): void => {
      if (!state.minimized && !state.maximized) return;
      state.minimized = false;
      state.maximized = false;
      win.emit('restore');
    },
    isMinimized: (): boolean => state.minimized,
    maximize: (): void => {
      if (state.maximized) return;
      state.maximized = true;
      win.emit('maximize');
    },
    unmaximize: (): void => {
      if (!state.maximized) return;
      state.maximized = false;
      win.emit('unmaximize');
    },
    isMaximized: (): boolean => state.maximized,
    setFullScreen: (on: boolean): void => {
      if (state.fullscreen === on) return;
      state.fullscreen = on;
      win.emit(on ? 'enter-full-screen' : 'leave-full-screen');
    },
    isFullScreen: (): boolean => state.fullscreen,
    focus: (): void => undefined,
    moveTop: (): void => undefined,
    isFocused: (): boolean => false,
  });
  return win;
};

export { keepOffScreen };

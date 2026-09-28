/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { BrowserWindow, Display } from 'electron';
import type { WindowMode } from '@drizztdourden08/brock-core/settings';
import type { WindowModeState } from '../../display.type';
import { HEADLESS_REASON } from '../drivers/display-mode-driver.constants';
import { finishWindowMode } from './finish-window-mode';
import { targetDisplay } from './target-display';
import type { WindowModeControl, WindowModeRuntime } from './window-mode.type';

const readState = (win: BrowserWindow | null, runtime: WindowModeRuntime): WindowModeState => ({
  mode: runtime.mode,
  monitorId: win ? String(screen.getDisplayMatching(win.getBounds()).id) : null,
  lastError: runtime.lastError,
});

const switchMode = (win: BrowserWindow, runtime: WindowModeRuntime, mode: WindowMode, display: Display): void => {
  const onTarget = screen.getDisplayMatching(win.getBounds()).id === display.id;
  runtime.mode = mode;
  if (!win.isFullScreen()) {
    finishWindowMode(win, runtime, mode, display);
    return;
  }
  if (mode === 'fullscreen' && onTarget) return;
  win.once('leave-full-screen', () => { finishWindowMode(win, runtime, mode, display); });
  win.setFullScreen(false);
};

const createWindowModeControl = (window: () => BrowserWindow | null, headless: boolean): WindowModeControl => {
  const runtime: WindowModeRuntime = { mode: 'windowed', windowedBounds: null, lastError: '' };
  return {
    read: () => readState(window(), runtime),
    apply: (mode, monitorId) => {
      const win = window();
      runtime.lastError = headless ? HEADLESS_REASON : '';
      if (win && !headless) switchMode(win, runtime, mode, targetDisplay(win, monitorId));
      return readState(win, runtime);
    },
    onFullscreenChange: (isFullscreen) => {
      if (isFullscreen) runtime.mode = 'fullscreen';
      else if (runtime.mode === 'fullscreen') runtime.mode = runtime.windowedBounds ? 'borderless' : 'windowed';
    },
  };
};

export { createWindowModeControl };

/* @layer electron-main @kind logic */
import { BrowserWindow } from 'electron';
import { modifierState } from './modifier-state';
import { windowGuide } from './window-guide';
import { FOCUS_SETTLE_MS, PER_STEP_MOVED_PLATFORMS } from './widget-windows.constants';

let pending: ReturnType<typeof setTimeout> | null = null;

const release = (): void => {
  if (!modifierState.ctrl) return;
  modifierState.ctrl = false;
  windowGuide.refresh();
};

const afterMove = (): void => {
  if (!PER_STEP_MOVED_PLATFORMS.includes(process.platform)) release();
};

const afterBlur = (): void => {
  if (pending) clearTimeout(pending);
  pending = setTimeout(() => {
    pending = null;
    if (!BrowserWindow.getFocusedWindow()) release();
  }, FOCUS_SETTLE_MS);
};

const modifierRelease = { afterMove, afterResize: release, afterBlur };

export { modifierRelease };

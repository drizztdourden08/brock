/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { ctrlFromInput } from './ctrl-from-input';
import { modifierRelease } from './modifier-release';
import { modifierState } from './modifier-state';
import { windowGuide } from './window-guide';
import type { ModifierInput } from './widget-windows.type';

const watchModifiers = (win: BrowserWindow): void => {
  const read = (input: ModifierInput): void => {
    const ctrl = ctrlFromInput(input);
    if (ctrl === null || ctrl === modifierState.ctrl) return;
    modifierState.ctrl = ctrl;
    windowGuide.refresh();
  };
  win.webContents.on('before-input-event', (_event, input) => read(input));
  win.webContents.on('input-event', (_event, input) => read(input));
  win.on('blur', modifierRelease.afterBlur);
};

export { watchModifiers };

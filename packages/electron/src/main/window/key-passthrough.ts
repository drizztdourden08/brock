/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { PASSTHROUGH_KEY } from './key-passthrough.constants';

const attachKeyPassthrough = (win: BrowserWindow): void => {
  win.webContents.on('before-input-event', (_event, input) => {
    const passThrough = input.type === 'keyDown' && PASSTHROUGH_KEY.test(input.key);
    win.webContents.setIgnoreMenuShortcuts(passThrough);
  });
};

export { attachKeyPassthrough };

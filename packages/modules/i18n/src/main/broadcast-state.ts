/* @layer electron-main @kind logic */
import { BrowserWindow } from 'electron';
import { emit } from '@drizztdourden08/brock-electron/main';
import type { I18nState } from '../i18n.type';

const broadcastState = (state: I18nState): void => {
  for (const win of BrowserWindow.getAllWindows()) emit(win, 'i18n:changed', state);
};

export { broadcastState };

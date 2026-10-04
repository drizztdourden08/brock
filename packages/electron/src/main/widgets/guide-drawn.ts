/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { getMainWindow } from '../window/get-main-window';
import { liveEntries } from './live-entries';
import { GUIDE_DRAWN_SCRIPT, MAIN_ANCHOR } from './widget-windows.constants';
import type { GuideDrawing } from './widget-windows.type';

const guideIn = async (win: BrowserWindow): Promise<string> => {
  try {
    const drawn: unknown = await win.webContents.executeJavaScript(GUIDE_DRAWN_SCRIPT);
    return typeof drawn === 'string' ? drawn : '';
  } catch {
    return '';
  }
};

const guideDrawn = async (): Promise<GuideDrawing> => {
  const main = getMainWindow();
  const windows: [string, BrowserWindow][] = [...(main && !main.isDestroyed() ? [[MAIN_ANCHOR, main] as [string, BrowserWindow]] : []), ...liveEntries().map(([id, entry]): [string, BrowserWindow] => [id, entry.win])];
  const seen = await Promise.all(windows.map(async ([id, win]) => ({ id, how: await guideIn(win) })));
  return { drawn: seen.filter((one) => one.how !== '').map((one) => one.id), beside: seen.filter((one) => one.how === 'beside').map((one) => one.id) };
};

export { guideDrawn };

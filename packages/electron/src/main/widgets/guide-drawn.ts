/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { getMainWindow } from '../window/get-main-window';
import { liveEntries } from './live-entries';
import { GUIDE_DRAWN_SCRIPT, MAIN_ANCHOR } from './widget-windows.constants';

const drawsGuide = async (win: BrowserWindow): Promise<boolean> => {
  try {
    return (await win.webContents.executeJavaScript(GUIDE_DRAWN_SCRIPT)) === true;
  } catch {
    return false;
  }
};

const guideDrawn = async (): Promise<string[]> => {
  const main = getMainWindow();
  const windows: [string, BrowserWindow][] = [...(main && !main.isDestroyed() ? [[MAIN_ANCHOR, main] as [string, BrowserWindow]] : []), ...liveEntries().map(([id, entry]): [string, BrowserWindow] => [id, entry.win])];
  const drawn = await Promise.all(windows.map(async ([id, win]) => ((await drawsGuide(win)) ? [id] : [])));
  return drawn.flat();
};

export { guideDrawn };

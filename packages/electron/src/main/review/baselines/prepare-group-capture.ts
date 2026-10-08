/* @layer electron-main @kind logic */
import { BrowserWindow } from 'electron';
import { prepareCapture } from './prepare-capture';
import { withinTime } from './within-time';

const hideRules = (selectors: readonly string[]): string => selectors.map((selector) => `${selector} { visibility: hidden !important; }`).join('\n');

const prepareGroupCapture = async (selectors: readonly string[]): Promise<() => Promise<void>> => {
  const windows = BrowserWindow.getAllWindows().filter((win) => !win.isDestroyed() && !win.webContents.isLoading());
  const inserted = await Promise.all(windows.map(async (win) => {
    await prepareCapture(win.webContents, []);
    const key = await withinTime(win.webContents.insertCSS(hideRules(selectors)));
    return key === null ? null : { win, key };
  }));
  return async () => {
    await Promise.all(inserted.map((entry) => (entry && !entry.win.isDestroyed() ? withinTime(entry.win.webContents.removeInsertedCSS(entry.key)) : null)));
  };
};

export { prepareGroupCapture };

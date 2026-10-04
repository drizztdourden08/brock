/* @layer tooling-scripts @kind logic */
import { WIDGET_QUERY_KEY } from './testing.constants.mjs';

const readWindows = ({ BrowserWindow }, key) => {
  const widgetIdOf = (url) => {
    try {
      return new URL(url).searchParams.get(key);
    } catch {
      return null;
    }
  };
  return BrowserWindow.getAllWindows().flatMap((win) => {
    const id = win.isDestroyed() ? null : widgetIdOf(win.webContents.getURL());
    if (!id) return [];
    return [{
      id,
      bounds: win.getBounds(),
      visible: win.isVisible(),
      focused: win.isFocused(),
      minimized: win.isMinimized(),
      alwaysOnTop: win.isAlwaysOnTop(),
    }];
  });
};

/**
 * @param {any} app Playwright's ElectronApplication
 * @returns {Promise<{ id: string, bounds: { x: number, y: number, width: number, height: number }, visible: boolean, focused: boolean, minimized: boolean, alwaysOnTop: boolean }[]>} sorted by id
 */
const widgetWindows = async (app) => {
  const windows = await app.evaluate(readWindows, WIDGET_QUERY_KEY);
  return windows.sort((a, b) => a.id.localeCompare(b.id));
};

export { widgetWindows };

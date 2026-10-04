/* @layer electron-main @kind logic */
import { getMainWindow } from '../window/get-main-window';
import { OWNER_PLATFORMS } from './widget-windows.constants';
import type { WidgetWindowEntry } from './widget-windows.type';

const applySync = (entry: WidgetWindowEntry): void => {
  const main = getMainWindow();
  const taskbar = entry.wantsTaskbar || !entry.sync;
  const owner = entry.sync && !taskbar && OWNER_PLATFORMS.includes(process.platform) && main && !main.isDestroyed() ? main : null;
  if (entry.win.getParentWindow() !== owner) entry.win.setParentWindow(owner);
  entry.win.setSkipTaskbar(!taskbar);
  entry.taskbar = taskbar;
};

export { applySync };

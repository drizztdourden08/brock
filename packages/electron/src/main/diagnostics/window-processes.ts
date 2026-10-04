/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { getMainWindow } from '../window/get-main-window';
import { widgetWindowControl } from '../widgets/widget-window-control';
import { MAIN_ANCHOR } from '../widgets/widget-windows.constants';

const rendererPid = (win: BrowserWindow | null): number | null => {
  if (!win || win.isDestroyed() || win.webContents.isDestroyed()) return null;
  const pid = win.webContents.getOSProcessId();
  return pid > 0 ? pid : null;
};

const windowProcesses = (): Map<number, string> => {
  const owners: [string, BrowserWindow | null][] = [
    [MAIN_ANCHOR, getMainWindow()],
    ...widgetWindowControl.list().map(({ id }): [string, BrowserWindow | null] => [id, widgetWindowControl.windowOf(id)]),
  ];
  const byPid = new Map<number, string>();
  for (const [id, win] of owners) {
    const pid = rendererPid(win);
    if (pid !== null && !byPid.has(pid)) byPid.set(pid, id);
  }
  return byPid;
};

export { windowProcesses };

/* @layer electron-main @kind logic */
import { getMainWindow } from '../window/get-main-window';
import { applyPin } from './apply-pin';
import { applySync } from './apply-sync';
import { mainOnTop } from './main-on-top';
import { tellMain } from './tell-main';
import { tellWindow } from './tell-window';
import { widgetWindowControl } from './widget-window-control';

const mainAway = (): boolean => {
  const main = getMainWindow();
  return main !== null && !main.isDestroyed() && (main.isMinimized() || !main.isVisible());
};

const setSync = (id: string, on: boolean): void => {
  const entry = widgetWindowControl.entryOf(id);
  if (!entry || entry.sync === on) return;
  entry.sync = on;
  applySync(entry);
  applyPin(entry, mainOnTop());
  if (on && mainAway() && entry.win.isVisible()) {
    entry.hiddenWithApp = true;
    entry.win.hide();
  }
  tellMain(id, { sync: on });
  tellWindow(entry);
};

const widgetMembership = { setSync };

export { widgetMembership };

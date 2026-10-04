/* @layer electron-main @kind logic */
import type { WidgetWindowGroup } from '@drizztdourden08/brock-core';
import { getMainWindow } from '../window/get-main-window';
import { applyPin } from './apply-pin';
import { applySync } from './apply-sync';
import { groupLayout } from './group-layout';
import { mainGroup } from './main-group';
import { mainOnTop } from './main-on-top';
import { tellMain } from './tell-main';
import { tellWindow } from './tell-window';
import { widgetWindowControl } from './widget-window-control';

const mainAway = (): boolean => {
  const main = getMainWindow();
  return main !== null && !main.isDestroyed() && (main.isMinimized() || !main.isVisible());
};

const leave = (group: WidgetWindowGroup | null): void => {
  if (group !== null && groupLayout.modeOf(group) !== 'normal') groupLayout.restore(group);
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

const setGroup = (id: string, group: WidgetWindowGroup | null): void => {
  const entry = widgetWindowControl.entryOf(id);
  if (!entry || entry.group === group) return;
  leave(entry.group);
  leave(group);
  entry.group = group;
  tellMain(id, { group });
  tellWindow(entry);
};

const setMainGroup = (group: WidgetWindowGroup | null): void => {
  const before = mainGroup.get();
  if (before === group) return;
  leave(before);
  leave(group);
  mainGroup.set(group);
};

const widgetMembership = { setSync, setGroup, setMainGroup };

export { widgetMembership };

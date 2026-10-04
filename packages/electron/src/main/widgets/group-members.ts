/* @layer electron-main @kind logic */
import type { WidgetWindowGroup } from '@drizztdourden08/brock-core';
import { getMainWindow } from '../window/get-main-window';
import { liveEntries } from './live-entries';
import { mainGroup } from './main-group';
import { MAIN_ANCHOR } from './widget-windows.constants';
import type { GroupMember } from './widget-windows.type';

const groupMembers = (group: WidgetWindowGroup | null): GroupMember[] => {
  if (group === null) return [];
  const main = getMainWindow();
  const own = main && !main.isDestroyed() && mainGroup.get() === group ? [{ id: MAIN_ANCHOR, win: main, entry: null }] : [];
  const widgets = liveEntries()
    .filter(([, entry]) => entry.group === group && !entry.closing)
    .sort(([, a], [, b]) => a.zStamp - b.zStamp)
    .map(([id, entry]) => ({ id, win: entry.win, entry }));
  return [...own, ...widgets];
};

export { groupMembers };

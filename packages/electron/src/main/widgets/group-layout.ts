/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { WidgetWindowBounds, WidgetWindowGroup } from '@drizztdourden08/brock-core';
import { emit } from '../ipc/emit';
import { boundsOf } from './bounds-of';
import { boundsUnion } from './bounds-union';
import { groupAreas } from './group-areas';
import { groupBackdrop } from './group-backdrop';
import { groupLayouts } from './group-layouts';
import { groupMembers } from './group-members';
import { holdFront } from './hold-front';
import { fitIntoArea } from './fit-into-area';
import { largestOverlap } from './largest-overlap';
import { memberOf } from './member-of';
import { minSizeOf } from './min-size-of';
import { placeMember } from './place-member';
import { releaseLayout } from './release-layout';
import { squareMember } from './square-member';
import { towHold } from './tow-hold';
import type { GroupLayout, GroupMember, GroupMode, GroupTarget } from './widget-windows.type';

const normalOf = (win: BrowserWindow): WidgetWindowBounds => {
  if (!win.isMaximized() && !win.isFullScreen()) return boundsOf(win);
  const { x, y, width, height } = win.getNormalBounds();
  if (win.isFullScreen()) win.setFullScreen(false);
  if (win.isMaximized()) win.unmaximize();
  return { x, y, width, height };
};

const tellMainState = (members: readonly GroupMember[], mode: GroupMode): void => {
  const main = members.find((member) => member.entry === null);
  if (!main || main.win.isDestroyed()) return;
  emit(main.win, 'window:maximized', mode === 'maximized');
  emit(main.win, 'window:fullscreen', mode === 'fullscreen');
};

const finish = (layout: GroupLayout, members: readonly GroupMember[]): void => {
  if (layout.mode !== 'fullscreen' || !layout.area) return;
  layout.backdrop = groupBackdrop(layout.area);
  for (const member of members) squareMember(member, true);
  layout.release = holdFront(members, layout.backdrop);
};

const enter = (group: WidgetWindowGroup, mode: GroupTarget, target?: WidgetWindowBounds): boolean => {
  const members = groupMembers(group);
  if (members.length < 2) return false;
  const prior = groupLayouts.get(group);
  towHold.hold();
  if (prior) releaseLayout(prior, members);
  const bases = members.map((member) => prior?.saved.get(member.id) ?? normalOf(member.win));
  const box = boundsUnion(bases);
  if (!box) return false;
  const areas = groupAreas(mode === 'fullscreen');
  const area = target ?? areas[largestOverlap(bases, areas)] ?? box;
  const saved = new Map(prior?.saved ?? []);
  const fitted = fitIntoArea(bases, members.map((member) => minSizeOf(member.win)), area);
  members.forEach((member, index) => {
    if (!saved.has(member.id)) saved.set(member.id, bases[index] ?? boundsOf(member.win));
    placeMember(member, fitted[index] ?? area, false);
  });
  const onTop = new Map(members.map((member) => [member.id, member.win.isAlwaysOnTop()]));
  const layout: GroupLayout = { mode, saved, onTop, backdrop: null, area, release: null };
  finish(layout, members);
  groupLayouts.set(group, layout);
  tellMainState(members, mode);
  return true;
};

const restore = (group: WidgetWindowGroup): boolean => {
  const layout = groupLayouts.get(group);
  if (!layout) return false;
  groupLayouts.delete(group);
  const members = [...layout.saved.keys()].map(memberOf).filter((member): member is GroupMember => member !== null);
  towHold.hold();
  releaseLayout(layout, members);
  for (const member of members) {
    const bounds = layout.saved.get(member.id);
    if (bounds) placeMember(member, bounds, true);
  }
  tellMainState(members, 'normal');
  return true;
};

const modeOf = (group: WidgetWindowGroup | null): GroupMode => (group === null ? 'normal' : groupLayouts.get(group)?.mode ?? 'normal');

const toggle = (group: WidgetWindowGroup, mode: GroupTarget): boolean => (modeOf(group) === mode ? restore(group) : enter(group, mode));

const groupLayout = { enter, restore, toggle, modeOf };

export { groupLayout };

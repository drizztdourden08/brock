/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { emit } from '../ipc/emit';
import { boundsOf } from './bounds-of';
import { boundsUnion } from './bounds-union';
import { clusterBackdrop } from './cluster-backdrop';
import { clusterLayouts } from './cluster-layouts';
import { clusterMembers } from './cluster-members';
import { holdFront } from './hold-front';
import { fitIntoArea } from './fit-into-area';
import { largestOverlap } from './largest-overlap';
import { layoutAreas } from './layout-areas';
import { memberOf } from './member-of';
import { minSizeOf } from './min-size-of';
import { placeMember } from './place-member';
import { releaseLayout } from './release-layout';
import { squareMember } from './square-member';
import { towHold } from './tow-hold';
import type { ClusterLayout, ClusterMember, LayoutMode, LayoutTarget } from './widget-windows.type';

const normalOf = (win: BrowserWindow): WidgetWindowBounds => {
  if (!win.isMaximized() && !win.isFullScreen()) return boundsOf(win);
  const { x, y, width, height } = win.getNormalBounds();
  if (win.isFullScreen()) win.setFullScreen(false);
  if (win.isMaximized()) win.unmaximize();
  return { x, y, width, height };
};

const tellMainState = (members: readonly ClusterMember[], mode: LayoutMode): void => {
  const main = members.find((member) => member.entry === null);
  if (!main || main.win.isDestroyed()) return;
  emit(main.win, 'window:maximized', mode === 'maximized');
  emit(main.win, 'window:fullscreen', mode === 'fullscreen');
};

const finish = (layout: ClusterLayout, members: readonly ClusterMember[]): void => {
  if (layout.mode !== 'fullscreen' || !layout.area) return;
  layout.backdrop = clusterBackdrop(layout.area);
  for (const member of members) squareMember(member, true);
  layout.release = holdFront(members, layout.backdrop);
};

const enter = (id: string, mode: LayoutTarget, target?: WidgetWindowBounds): boolean => {
  const members = clusterMembers(id);
  if (members.length < 2) return false;
  const prior = clusterLayouts.of(id);
  towHold.hold();
  if (prior) {
    clusterLayouts.remove(prior);
    releaseLayout(prior, members);
  }
  const bases = members.map((member) => prior?.saved.get(member.id) ?? normalOf(member.win));
  const box = boundsUnion(bases);
  if (!box) return false;
  const areas = layoutAreas(mode === 'fullscreen');
  const area = target ?? areas[largestOverlap(bases, areas)] ?? box;
  const saved = new Map(prior?.saved ?? []);
  const fitted = fitIntoArea(bases, members.map((member) => minSizeOf(member.win)), area);
  members.forEach((member, index) => {
    if (!saved.has(member.id)) saved.set(member.id, bases[index] ?? boundsOf(member.win));
    placeMember(member, fitted[index] ?? area, false);
  });
  const onTop = new Map(members.map((member) => [member.id, member.win.isAlwaysOnTop()]));
  const layout: ClusterLayout = { mode, saved, onTop, backdrop: null, area, release: null };
  finish(layout, members);
  clusterLayouts.add(layout);
  tellMainState(members, mode);
  return true;
};

const restore = (id: string): boolean => {
  const layout = clusterLayouts.of(id);
  if (!layout) return false;
  clusterLayouts.remove(layout);
  const members = [...layout.saved.keys()].map(memberOf).filter((member): member is ClusterMember => member !== null);
  towHold.hold();
  releaseLayout(layout, members);
  for (const member of members) {
    const bounds = layout.saved.get(member.id);
    if (bounds) placeMember(member, bounds, true);
  }
  tellMainState(members, 'normal');
  return true;
};

const modeOf = (id: string): LayoutMode => clusterLayouts.of(id)?.mode ?? 'normal';

const toggle = (id: string, mode: LayoutTarget): boolean => (modeOf(id) === mode ? restore(id) : enter(id, mode));

const clusterLayout = { enter, restore, toggle, modeOf };

export { clusterLayout };

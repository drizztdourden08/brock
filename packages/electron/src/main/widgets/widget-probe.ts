/* @layer electron-main @kind logic */
import type { WidgetProbeRequest, WidgetProbeResult, WidgetWindowBounds, WidgetWindowPoint } from '@drizztdourden08/brock-core';
import { getMainWindow } from '../window/get-main-window';
import { boundsOf } from './bounds-of';
import { dragInSignal } from './drag-in-signal';
import { dropPointAt } from './drop-point-at';
import { isReachable } from './is-reachable';
import { liveEntries } from './live-entries';
import { mainSnap } from './main-snap';
import { mainSnapState } from './main-snap-state';
import { moveEntry } from './move-entry';
import { relink } from './relink';
import { rescueWidgetWindows } from './rescue-widget-windows';
import { settleWindow } from './settle-window';
import { snapMainAt } from './snap-main-at';
import { snapTargets } from './snap-targets';
import { snapTo } from './snap-to';
import { widgetAreas } from './widget-areas';
import { widgetWindowControl } from './widget-window-control';
import { PROBE_SETTLE_MS } from './widget-windows.constants';

const settled = (): Promise<void> => new Promise((resolve) => { setTimeout(resolve, PROBE_SETTLE_MS); });

const outside = (): string[] => {
  const areas = widgetAreas();
  return liveEntries().filter(([, entry]) => !isReachable(boundsOf(entry.win), areas)).map(([id]) => id);
};

const windowResult = (id: string | null, counted = false): WidgetProbeResult => {
  const entry = id === null ? null : widgetWindowControl.entryOf(id);
  return { bounds: entry ? boundsOf(entry.win) : null, link: entry?.link ?? null, counted, outside: outside() };
};

const mainResult = (): WidgetProbeResult => {
  const main = getMainWindow();
  return { bounds: main && !main.isDestroyed() ? boundsOf(main) : null, link: null, counted: false, outside: outside() };
};

const dragRelease = (id: string, bounds: WidgetWindowBounds): WidgetProbeResult => {
  const entry = widgetWindowControl.entryOf(id);
  if (!entry) return windowResult(null);
  const hit = entry.snap ? snapTo(bounds, snapTargets(id)) : null;
  if (entry.snap) relink(id, entry, hit?.link ?? null);
  entry.win.setBounds(hit?.bounds ?? bounds);
  settleWindow(id);
  return windowResult(id);
};

const setMain = async (bounds: WidgetWindowBounds | undefined, drag: boolean): Promise<WidgetProbeResult> => {
  const main = getMainWindow();
  if (!main || main.isDestroyed() || !bounds) return mainResult();
  const hit = drag ? snapMainAt(bounds) : null;
  main.setBounds(hit?.bounds ?? bounds);
  if (drag) {
    mainSnapState.hit = hit;
    mainSnap.settle();
  }
  await settled();
  return mainResult();
};

const dragIn = (id: string, point: WidgetWindowPoint | null, release: boolean): WidgetProbeResult => {
  const main = getMainWindow();
  const entry = widgetWindowControl.entryOf(id);
  if (!main || main.isDestroyed() || !entry) return windowResult(id);
  const content = main.getContentBounds();
  const target = point ? dropPointAt(id, { x: content.x + point.x, y: content.y + point.y }, content) : null;
  if (release && target) dragInSignal.drop(id, entry, target);
  else dragInSignal.over(id, entry, target);
  return windowResult(id, target !== null);
};

const rescue = (id: string, bounds: WidgetWindowBounds): WidgetProbeResult => {
  const entry = widgetWindowControl.entryOf(id);
  if (entry) moveEntry(entry, bounds);
  rescueWidgetWindows();
  return windowResult(id);
};

const widgetProbe = async (request: WidgetProbeRequest): Promise<WidgetProbeResult> => {
  if (request.kind === 'window') return windowResult(request.id);
  if (request.kind === 'drag') return dragRelease(request.id, request.bounds);
  if (request.kind === 'main') return setMain(request.bounds, false);
  if (request.kind === 'mainDrag') return setMain(request.bounds, true);
  if (request.kind === 'dragOver') return dragIn(request.id, request.point, false);
  if (request.kind === 'drop') return dragIn(request.id, request.point, true);
  if (request.kind === 'rescue') return rescue(request.id, request.bounds);
  return windowResult(null);
};

export { widgetProbe };

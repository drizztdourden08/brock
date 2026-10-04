/* @layer electron-main @kind logic */
import type { WidgetProbeRequest, WidgetProbeResult, WidgetWindowBounds, WidgetWindowPoint } from '@drizztdourden08/brock-core';
import { getMainWindow } from '../window/get-main-window';
import { boundsOf } from './bounds-of';
import { dragInSignal } from './drag-in-signal';
import { dropPointAt } from './drop-point-at';
import { isReachable } from './is-reachable';
import { liveEntries } from './live-entries';
import { modifierState } from './modifier-state';
import { moveEntry } from './move-entry';
import { moveStep } from './move-step';
import { probeFacts } from './probe-facts';
import { rescueWidgetWindows } from './rescue-widget-windows';
import { snapMainAt } from './snap-main-at';
import { snapTargets } from './snap-targets';
import { snapTo } from './snap-to';
import { widgetAreas } from './widget-areas';
import { widgetWindowControl } from './widget-window-control';
import { windowProbe } from './window-probe';
import { MAIN_ANCHOR, PROBE_SETTLE_MS } from './widget-windows.constants';
import type { MoveSession } from './widget-windows.type';

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

const startDrag = (id: string, alone: boolean): MoveSession => {
  const held = modifierState.ctrl;
  modifierState.ctrl = alone;
  const session = moveStep(id);
  modifierState.ctrl = held;
  return session;
};

const dragRelease = async (id: string, bounds: WidgetWindowBounds, alone: boolean): Promise<WidgetProbeResult> => {
  const entry = widgetWindowControl.entryOf(id);
  if (!entry) return windowResult(null);
  const session = startDrag(id, alone);
  session.hit = entry.snap ? snapTo(bounds, snapTargets(id).filter((target) => !session.members.has(target.to))) : null;
  entry.win.setBounds(session.hit?.bounds ?? bounds);
  entry.win.emit('moved');
  await settled();
  return windowResult(id);
};

const setMain = async (bounds: WidgetWindowBounds | undefined): Promise<WidgetProbeResult> => {
  const main = getMainWindow();
  if (!main || main.isDestroyed() || !bounds) return mainResult();
  main.setBounds(bounds);
  await settled();
  return mainResult();
};

const dragMain = async (bounds: WidgetWindowBounds, alone: boolean): Promise<WidgetProbeResult> => {
  const main = getMainWindow();
  if (!main || main.isDestroyed()) return mainResult();
  const session = startDrag(MAIN_ANCHOR, alone);
  session.hit = snapMainAt(bounds, session.members);
  main.setBounds(session.hit?.bounds ?? bounds);
  main.emit('moved');
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

const withFacts = async (request: WidgetProbeRequest): Promise<WidgetProbeResult> => {
  const facts = await windowProbe(request);
  const id = 'id' in request ? request.id : null;
  return facts ? { ...windowResult(id === MAIN_ANCHOR ? null : id), facts } : windowResult(null);
};

const widgetProbe = async (request: WidgetProbeRequest): Promise<WidgetProbeResult> => {
  if (request.kind === 'window') return { ...windowResult(request.id), facts: probeFacts(request.id) };
  if (request.kind === 'drag') return dragRelease(request.id, request.bounds, request.alone === true);
  if (request.kind === 'main') return setMain(request.bounds);
  if (request.kind === 'mainDrag') return dragMain(request.bounds, request.alone === true);
  if (request.kind === 'dragOver') return dragIn(request.id, request.point, false);
  if (request.kind === 'drop') return dragIn(request.id, request.point, true);
  if (request.kind === 'rescue') return rescue(request.id, request.bounds);
  return withFacts(request);
};

export { widgetProbe };

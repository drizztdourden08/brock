/* @layer renderer-shell @kind logic */
import type { WidgetProbeFacts, WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { requireHostApi } from '../../host/require-host-api';
import { nav } from '../../navigation/nav';
import { find } from '../dom/find';
import type { StepTour } from '../review.type';
import type { ClusterPair } from './cluster-check.type';
import { checkClusterMoves } from './cluster-move-check';
import { clusterFits } from './cluster-fits';
import { poppedEntry } from './popped-entry';
import { probe } from './probe';
import { sameRect } from './same-rect';
import { soon } from './soon';
import { EDGE_DROP, MAIN_LINK, SMALL_AREA, SNAP_NEAR, SQUARE_SCREEN, SQUARE_SELECTOR } from './widget-review.constants';

const pair = (facts: WidgetProbeFacts | undefined, id: string): ClusterPair | null => {
  const main = facts?.windows[MAIN_LINK];
  const own = facts?.windows[id];
  return main && own ? [main, own] : null;
};

const fills = (facts: WidgetProbeFacts | undefined, id: string, before: ClusterPair): boolean => {
  const after = pair(facts, id);
  return after !== null && facts?.area !== null && facts?.area !== undefined && clusterFits(after, before, facts.area);
};

const restored = (facts: WidgetProbeFacts | undefined, id: string, before: ClusterPair): boolean => {
  const after = pair(facts, id);
  return after !== null && sameRect(after[0], before[0]) && sameRect(after[1], before[1]);
};

const snapOn = async (id: string): Promise<boolean> => {
  const main = (await probe({ kind: 'main' })).bounds;
  const own = (await probe({ kind: 'window', id })).bounds;
  if (!main || !own) return false;
  const snapped = await probe({ kind: 'drag', alone: true, id, bounds: { ...own, x: main.x + main.width + SNAP_NEAR, y: main.y + EDGE_DROP } });
  const facts = (await probe({ kind: 'window', id })).facts;
  return snapped.link?.to === MAIN_LINK && facts?.cluster.includes(MAIN_LINK) === true && await soon(() => poppedEntry(id)?.link?.to === MAIN_LINK);
};

const enterFullscreen = async (id: string, before: ClusterPair): Promise<string | null> => {
  const full = (await probe({ kind: 'cluster', id: MAIN_LINK, action: 'fullscreen' })).facts;
  const own = (await probe({ kind: 'window', id })).facts;
  const drawn = await soon(() => find(SQUARE_SELECTOR) !== null);
  const facts = { backdrop: full?.backdrop, square: full?.square, ownSquare: own?.square, drawn, fills: fills(full, id, before) };
  return Object.values(facts).every((value) => value === true) ? null : JSON.stringify(facts);
};

const exitFullscreen = async (id: string, before: ClusterPair): Promise<boolean> => {
  const exit = (await probe({ kind: 'cluster', id: MAIN_LINK, action: 'restore' })).facts;
  const gone = await soon(() => find(SQUARE_SELECTOR) === null);
  return exit?.backdrop === false && !exit.square && gone && restored(exit, id, before);
};

const checkFullscreen = async (tour: StepTour, id: string, before: ClusterPair): Promise<void> => {
  nav.open(SQUARE_SCREEN);
  const missed = await enterFullscreen(id, before);
  tour.check('cluster-fullscreen', missed === null, 'full screen filled the display with the snapped windows, opened the black backdrop and sent the square flag to each of them, and the open screen drew square', `full screen missed the backdrop, the square flag or the display (${missed ?? ''})`);
  await requireHostApi().reviewCaptureGroup('cluster-fullscreen');
  const left = await exitFullscreen(id, before);
  nav.close();
  tour.check('cluster-fullscreen-exit', left, 'leaving full screen removed the backdrop and the square flag and put each snapped window back', 'leaving full screen left the backdrop, the square flag or moved bounds behind');
};

const checkSmallArea = async (tour: StepTour, id: string, before: ClusterPair, real: WidgetWindowBounds | null): Promise<void> => {
  const area = { ...SMALL_AREA, x: (real?.x ?? 0) + SMALL_AREA.x, y: (real?.y ?? 0) + SMALL_AREA.y };
  const small = (await probe({ kind: 'cluster', id: MAIN_LINK, action: 'maximize', area })).facts;
  const back = (await probe({ kind: 'cluster', id: MAIN_LINK, action: 'restore' })).facts;
  const kept = fills(small, id, before) && restored(back, id, before);
  tour.check('cluster-maximize-small', kept, `on a simulated ${SMALL_AREA.width}x${SMALL_AREA.height} work area the snapped windows stayed inside it, filled it in order, and restore put them back`, `on a simulated ${SMALL_AREA.width}x${SMALL_AREA.height} work area a window spilled out or did not come back (${JSON.stringify({ area, windows: small?.windows })})`);
};

const checkLayouts = async (tour: StepTour, id: string, before: ClusterPair): Promise<void> => {
  const max = (await probe({ kind: 'cluster', id: MAIN_LINK, action: 'maximize' })).facts;
  tour.check('cluster-maximize', fills(max, id, before), 'maximizing the app scaled every window snapped to it into the work area, each inside it and in order', `a snapped window left the work area or they did not fill it (${JSON.stringify({ area: max?.area, windows: max?.windows })})`);
  const back = (await probe({ kind: 'cluster', id: MAIN_LINK, action: 'restore' })).facts;
  tour.check('cluster-restore', restored(back, id, before), 'restoring put each snapped window back on its exact bounds', `restoring moved a window (${JSON.stringify(back?.windows)})`);
  await checkSmallArea(tour, id, before, max?.area ?? null);
  await checkFullscreen(tour, id, before);
};

const checkClusters = async (tour: StepTour, id: string): Promise<void> => {
  const joined = await snapOn(id);
  tour.check('cluster-joined', joined, `snapping the "${id}" window onto the app put the two in one cluster and the layout saved the link`, `the "${id}" window did not join the app's cluster`);
  const before = pair((await probe({ kind: 'window', id })).facts, id);
  if (!joined || !before) return;
  await checkClusterMoves(tour, id, before);
  await checkLayouts(tour, id, before);
  const free = await probe({ kind: 'drag', alone: true, id, bounds: { ...before[1], x: before[1].x + EDGE_DROP } });
  const facts = (await probe({ kind: 'window', id })).facts;
  const detached = free.link === null && sameRect(facts?.windows[MAIN_LINK], before[0]) && facts?.cluster.length === 1;
  tour.check('cluster-ctrl-detach', detached, `moving the "${id}" window with Ctrl took it out of the cluster alone, the app stayed and the link broke`, `the Ctrl move did not detach the "${id}" window (${JSON.stringify({ link: free.link, cluster: facts?.cluster, windows: facts?.windows })})`);
};

export { checkClusters };

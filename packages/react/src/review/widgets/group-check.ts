/* @layer renderer-shell @kind logic */
import type { WidgetProbeFacts, WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { requireHostApi } from '../../host/require-host-api';
import { nav } from '../../navigation/nav';
import { find } from '../dom/find';
import { until } from '../dom/until';
import type { StepTour } from '../review.type';
import { groupFits } from './group-fits';
import { poppedWire } from './popped-wire';
import { probe } from './probe';
import { sameRect } from './same-rect';
import { soon } from './soon';
import { MAIN_LINK, REVIEW_GROUP, SMALL_AREA, SQUARE_SCREEN, SQUARE_SELECTOR } from './widget-review.constants';

const pair = (facts: WidgetProbeFacts | undefined, id: string): [WidgetWindowBounds, WidgetWindowBounds] | null => {
  const main = facts?.windows[MAIN_LINK];
  const own = facts?.windows[id];
  return main && own ? [main, own] : null;
};

const fills = (facts: WidgetProbeFacts | undefined, id: string, before: [WidgetWindowBounds, WidgetWindowBounds]): boolean => {
  const after = pair(facts, id);
  return after !== null && facts?.area !== null && facts?.area !== undefined && groupFits(after, before, facts.area);
};

const restored = (facts: WidgetProbeFacts | undefined, id: string, before: [WidgetWindowBounds, WidgetWindowBounds]): boolean => {
  const after = pair(facts, id);
  return after !== null && sameRect(after[0], before[0]) && sameRect(after[1], before[1]);
};

const joinGroup = async (id: string, group: string | null): Promise<boolean> => {
  requireHostApi().setMainWindowGroup(group);
  requireHostApi().setWidgetGroup(id, group);
  return until(async () => {
    const [main, own] = await Promise.all([probe({ kind: 'window', id: MAIN_LINK }), probe({ kind: 'window', id })]);
    return main.facts?.group === group && own.facts?.group === group;
  });
};

const enterFullscreen = async (id: string, before: [WidgetWindowBounds, WidgetWindowBounds]): Promise<string | null> => {
  const full = (await probe({ kind: 'group', id: MAIN_LINK, action: 'fullscreen' })).facts;
  const own = (await probe({ kind: 'window', id })).facts;
  const drawn = await soon(() => find(SQUARE_SELECTOR) !== null);
  const facts = { backdrop: full?.backdrop, square: full?.square, ownSquare: own?.square, drawn, fills: fills(full, id, before) };
  return Object.values(facts).every((value) => value === true) ? null : JSON.stringify(facts);
};

const exitFullscreen = async (id: string, before: [WidgetWindowBounds, WidgetWindowBounds]): Promise<boolean> => {
  const exit = (await probe({ kind: 'group', id: MAIN_LINK, action: 'restore' })).facts;
  const gone = await soon(() => find(SQUARE_SELECTOR) === null);
  return exit?.backdrop === false && !exit.square && gone && restored(exit, id, before);
};

const checkFullscreen = async (tour: StepTour, id: string, before: [WidgetWindowBounds, WidgetWindowBounds]): Promise<void> => {
  nav.open(SQUARE_SCREEN);
  const missed = await enterFullscreen(id, before);
  tour.check('group-fullscreen', missed === null, 'full screen filled the display with the group, opened the black backdrop and sent the square flag to every member, and the open screen drew square', `full screen missed the backdrop, the square flag or the display (${missed ?? ''})`);
  await requireHostApi().reviewCaptureGroup('group-fullscreen');
  const left = await exitFullscreen(id, before);
  nav.close();
  tour.check('group-fullscreen-exit', left, 'leaving full screen removed the backdrop and the square flag and put every member back', 'leaving full screen left the backdrop, the square flag or moved bounds behind');
};

const checkSmallArea = async (tour: StepTour, id: string, before: [WidgetWindowBounds, WidgetWindowBounds], real: WidgetWindowBounds | null): Promise<void> => {
  const area = { ...SMALL_AREA, x: (real?.x ?? 0) + SMALL_AREA.x, y: (real?.y ?? 0) + SMALL_AREA.y };
  const small = (await probe({ kind: 'group', id: MAIN_LINK, action: 'maximize', area })).facts;
  const back = (await probe({ kind: 'group', id: MAIN_LINK, action: 'restore' })).facts;
  const kept = fills(small, id, before) && restored(back, id, before);
  tour.check('group-maximize-small', kept, `on a simulated ${SMALL_AREA.width}x${SMALL_AREA.height} work area the group stayed inside it, filled it in order, and restore put it back`, `on a simulated ${SMALL_AREA.width}x${SMALL_AREA.height} work area a member spilled out or did not come back (${JSON.stringify({ area, windows: small?.windows })})`);
};

const checkGroups = async (tour: StepTour, id: string): Promise<void> => {
  const joined = await joinGroup(id, REVIEW_GROUP);
  const saved = joined && await soon(() => poppedWire(id)?.group === REVIEW_GROUP);
  tour.check('group-joined', saved, `the app and the "${id}" window joined group ${REVIEW_GROUP} and the layout saved it`, `the app or the "${id}" window did not join the group`);
  const before = pair((await probe({ kind: 'window', id })).facts, id);
  if (!saved || !before) return;
  const max = (await probe({ kind: 'group', id: MAIN_LINK, action: 'maximize' })).facts;
  tour.check('group-maximize', fills(max, id, before), 'maximizing the app scaled the whole group into the work area, every member inside it and in order', `a member left the work area or the group did not fill it (${JSON.stringify({ area: max?.area, windows: max?.windows })})`);
  const back = (await probe({ kind: 'group', id: MAIN_LINK, action: 'restore' })).facts;
  tour.check('group-restore', restored(back, id, before), 'restoring put every member back on its exact bounds', `restoring moved a member (${JSON.stringify(back?.windows)})`);
  await checkSmallArea(tour, id, before, max?.area ?? null);
  await checkFullscreen(tour, id, before);
  await joinGroup(id, null);
};

export { checkGroups };

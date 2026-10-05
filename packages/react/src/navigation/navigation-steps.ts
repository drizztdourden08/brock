/* @layer renderer-shell @kind logic */
import { HISTORY_LIMIT, NO_PARAMS } from './navigation.constants';
import type { NavigationHistory, NavigationSnapshot, NavigationStep as Step, ResolvedRoute, ScreenParams } from './navigation.type';

const stable = (params: ScreenParams): string =>
  JSON.stringify(Object.entries(params).filter(([, value]) => value !== undefined).sort(([a], [b]) => a.localeCompare(b)));

const sameParams = (a: ScreenParams, b: ScreenParams): boolean => stable(a) === stable(b);

const isBare = (params: ScreenParams): boolean => Object.values(params).every((value) => value === undefined);

const pushed = (history: NavigationHistory, id: string, params: ScreenParams): NavigationHistory =>
  ({ ...history, [id]: [...(history[id] ?? []), params].slice(-HISTORY_LIMIT) });

const without = <T>(record: Record<string, T>, id: string): Record<string, T> =>
  Object.fromEntries(Object.entries(record).filter(([key]) => key !== id));

const isHere = (state: NavigationSnapshot, target: ResolvedRoute): boolean =>
  state.active === target.active && sameParams(state.params, target.params);

const openStep = (state: NavigationSnapshot, target: ResolvedRoute, fresh = false): Step => {
  const { active, params, history, remembered } = state;
  if (active === target.active) return { params: target.params, history: pushed(history, active, params), parent: null };
  const kept = active === null ? remembered : { ...remembered, [active]: params };
  const back = fresh ? undefined : remembered[target.active];
  const restored = isBare(target.params) && back !== undefined ? back : target.params;
  return { active: target.active, params: restored, remembered: kept, parent: null };
};

const closeStep = (state: NavigationSnapshot): Step => {
  const { active, params, history, remembered } = state;
  if (active === null) return {};
  return { active: null, params: NO_PARAMS, parent: null, escapeTo: null, history: without(history, active), remembered: { ...remembered, [active]: params } };
};

const backStep = (state: NavigationSnapshot): Step | null => {
  const { active, history, parent } = state;
  if (active === null) return null;
  const trail = history[active] ?? [];
  const previous = trail.at(-1);
  if (previous !== undefined) return { params: previous, history: { ...history, [active]: trail.slice(0, -1) }, parent: null };
  return parent === null ? null : { params: parent, parent: null };
};

const upStep = (state: NavigationSnapshot, parent: ScreenParams): Step | null => {
  const { active, history } = state;
  if (active === null) return null;
  const trail = history[active] ?? [];
  const previous = trail.at(-1);
  if (previous !== undefined && sameParams(previous, parent)) return { params: previous, history: { ...history, [active]: trail.slice(0, -1) }, parent: null };
  return { params: parent, parent: null };
};

const backTarget = (state: NavigationSnapshot): ScreenParams | null =>
  (state.active === null ? null : state.history[state.active]?.at(-1) ?? state.parent);

const canGoBack = (state: NavigationSnapshot): boolean => backTarget(state) !== null;

const navigationSteps = { open: openStep, close: closeStep, back: backStep, up: upStep, backTarget, canGoBack, isHere, isBare };

export { navigationSteps };

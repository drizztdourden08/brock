/* @layer renderer-shell @kind logic */
import { PAGE_SEARCH_KEY } from '../hub/hub.constants';
import { ROUTE_SEPARATOR } from '../navigation/navigation.constants';
import { useScreenStateStore } from '../stores/useScreenStateStore';
import type { TourResetHandler, TourResetPart, TourResetParts } from '../tours/tour.type';
import { ALL_PARTS, TAB_KEY_PREFIX } from './screen-reset.constants';
import type { ResetFlags } from './screen-reset.type';
import { WINDOW_STATE_KEY } from './window/window.constants';

const handlers = new Map<string, Set<TourResetHandler>>();

const classified = new Map<string, Map<string, TourResetPart>>();

const resolveParts = (reset: true | TourResetParts): ResetFlags =>
  (reset === true ? ALL_PARTS : { search: reset.search === true, filters: reset.filters === true, tab: reset.tab === true, selection: reset.selection === true });

const isInScreen = (scope: string, screen: string): boolean => scope === screen || scope.startsWith(`${screen}${ROUTE_SEPARATOR}`);

const builtInPart = (key: string): TourResetPart | undefined => {
  if (key === PAGE_SEARCH_KEY) return 'search';
  return key === WINDOW_STATE_KEY || key.startsWith(TAB_KEY_PREFIX) ? 'tab' : undefined;
};

const partOf = (scope: string, key: string): TourResetPart | undefined => classified.get(scope)?.get(key) ?? builtInPart(key);

const classify = (scope: string, key: string, part: TourResetPart): void => {
  const keys = classified.get(scope) ?? new Map<string, TourResetPart>();
  keys.set(key, part);
  classified.set(scope, keys);
};

const onReset = (scope: string, handler: TourResetHandler): (() => void) => {
  const set = handlers.get(scope) ?? new Set<TourResetHandler>();
  set.add(handler);
  handlers.set(scope, set);
  return () => {
    set.delete(handler);
    if (set.size === 0 && handlers.get(scope) === set) handlers.delete(scope);
  };
};

const clearStored = (screen: string, wanted: ResetFlags): void => {
  const store = useScreenStateStore.getState();
  for (const [scope, values] of Object.entries(store.byScope)) {
    if (!isInScreen(scope, screen)) continue;
    const keys = Object.keys(values).filter((key) => {
      const part = partOf(scope, key);
      return part !== undefined && wanted[part];
    });
    if (keys.length > 0) store.drop(scope, keys);
  }
};

const reset = (screen: string, parts: true | TourResetParts): void => {
  const wanted = resolveParts(parts);
  clearStored(screen, wanted);
  for (const [scope, set] of handlers) {
    if (isInScreen(scope, screen)) set.forEach((handler) => handler(wanted));
  }
};

const screenReset = { classify, onReset, reset, resolveParts };

export { screenReset };

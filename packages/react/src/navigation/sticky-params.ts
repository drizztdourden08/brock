/* @layer renderer-shell @kind logic */
import { NO_PARAMS } from './navigation.constants';
import type { StickyParamsRegistry } from './navigation.type';

const sticky = new Map<string, readonly string[]>();

const stickyParams: StickyParamsRegistry = {
  set: (screen, keys) => {
    if (keys === undefined || keys.length === 0) sticky.delete(screen);
    else sticky.set(screen, keys);
  },
  keys: (screen) => (screen === null ? [] : sticky.get(screen) ?? []),
  pick: (screen, params) => {
    const picked = Object.fromEntries(stickyParams.keys(screen).filter((key) => params[key] !== undefined).map((key) => [key, params[key]]));
    return Object.keys(picked).length === 0 ? NO_PARAMS : picked;
  },
};

export { stickyParams };

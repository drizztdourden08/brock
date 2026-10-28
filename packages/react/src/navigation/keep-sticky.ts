/* @layer renderer-shell @kind logic */
import { NO_PARAMS } from './navigation.constants';
import type { NavigationSnapshot, ResolvedRoute, ScreenParams } from './navigation.type';
import { stickyParams } from './sticky-params';

const isBare = (params: ScreenParams): boolean => Object.values(params).every((value) => value === undefined);

const sourceOf = (state: NavigationSnapshot, target: ResolvedRoute, fresh: boolean): ScreenParams => {
  if (fresh) return NO_PARAMS;
  if (state.active === target.active) return state.params;
  return isBare(target.params) ? NO_PARAMS : state.remembered[target.active] ?? NO_PARAMS;
};

const keepSticky = (state: NavigationSnapshot, target: ResolvedRoute, fresh = false): ResolvedRoute => {
  const keys = stickyParams.keys(target.active);
  if (keys.length === 0) return target;
  const source = sourceOf(state, target, fresh);
  const carried = keys.filter((key) => !Object.hasOwn(target.params, key) && source[key] !== undefined);
  if (carried.length === 0) return target;
  return { active: target.active, params: { ...target.params, ...Object.fromEntries(carried.map((key) => [key, source[key]])) } };
};

export { keepSticky };
